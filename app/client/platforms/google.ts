"use client";

import {
  ApiPath,
  DEFAULT_MODELS,
  GEMINI_BASE_URL,
  Google,
  REQUEST_TIMEOUT_MS,
  ServiceProvider,
} from "@/app/constant";
import { useAccessStore, useAppConfig, useChatStore } from "@/app/store";
import { getClientConfig } from "@/app/config/client";
import {
  getMessageImages,
  getMessageTextContent,
  getTimeoutMSByModel,
} from "@/app/utils";
import { getModelCapabilitiesWithCustomConfig } from "@/app/config/model-capabilities";
import { getModelTools } from "@/app/config/tools";
import { ChatOptions, LLMApi, LLMModel, LLMUsage, getHeaders } from "../api";
import { fetch } from "@/app/utils/stream";
import { streamWithThink } from "@/app/utils/chat";

export class GoogleApi implements LLMApi {
  private path(path: string): string {
    const access = useAccessStore.getState();
    let baseUrl = "";

    if (access.useCustomConfig) {
      baseUrl = access.googleUrl;
    }

    if (!baseUrl) {
      const isApp = !!getClientConfig()?.isApp;
      baseUrl = isApp ? GEMINI_BASE_URL : ApiPath.Google;
    }

    if (baseUrl.endsWith("/")) baseUrl = baseUrl.slice(0, -1);
    if (!baseUrl.startsWith("http") && baseUrl !== ApiPath.Google) {
      baseUrl = "https://" + baseUrl;
    }
    return [baseUrl, path].join("/");
  }

  async chat(options: ChatOptions): Promise<void> {
    const controller = new AbortController();
    options.onController?.(controller);

    const timeoutId = setTimeout(
      () => controller.abort(),
      getTimeoutMSByModel(options.config.model) ?? REQUEST_TIMEOUT_MS,
    );

    try {
      // 1) 内容映射（user/model + parts[text/inline_data]）
      const messages = options.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => {
          const text = getMessageTextContent(m);
          const images = getMessageImages(m);
          const parts: any[] = [];
          if (text && text.trim()) parts.push({ text });
          if (images?.length) {
            for (const img of images) {
              const [meta, data] = img.split(",");
              const mimeType = meta.split(":")[1].split(";")[0];
              parts.push({ inline_data: { mime_type: mimeType, data } });
            }
          }
          return { role: m.role === "assistant" ? "model" : "user", parts };
        })
        .filter((m) => m.parts.length > 0);

      // 2) 生成/安全/工具配置
      const appConfig = useAppConfig.getState().modelConfig;
      const sessionConfig = useChatStore.getState().currentSession()
        .mask.modelConfig;
      const fullModelCfg: any = {
        ...appConfig,
        ...sessionConfig,
        model: options.config.model,
      };

      // 安全设置：统一关闭（OFF）
      const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "OFF" },
      ];

      const tools = getModelTools(options.config.model, {
        enableWebSearch:
          useChatStore.getState().currentSession().searchEnabled ?? false,
      });

      // 生成配置（仅适配 Google 支持的键）
      const generationConfig: any = {
        temperature: fullModelCfg.temperature,
        maxOutputTokens: fullModelCfg.max_tokens,
        topP: fullModelCfg.top_p,
        topK: fullModelCfg.top_k,
      };

      // 思考配置（仅 reasoning 模型 + Gemini 类型生效）
      const cap = getModelCapabilitiesWithCustomConfig(options.config.model);
      let thinkingConfig: any | undefined;
      if (cap?.reasoning && cap?.thinkingType === "gemini") {
        thinkingConfig = {
          includeThoughts: true,
        } as any;
        // 优先使用模型配置；否则给一个合理的缺省（8192）
        const budget =
          typeof fullModelCfg.thinkingBudget !== "undefined"
            ? fullModelCfg.thinkingBudget
            : 8192;
        thinkingConfig.thinkingBudget = budget;
      }

      // 3) 目标路径（SSE 流式）
      const chatPath = this.path(
        Google.ChatPath(options.config.model) + "?alt=sse",
      );

      // 4) 请求负载
      // 按官方 REST 规范：thinkingConfig 应置于 generationConfig 内
      if (thinkingConfig) {
        generationConfig.thinkingConfig = thinkingConfig;
      }

      const requestPayload: any = {
        contents: messages,
        ...(tools.length > 0 ? { tools } : {}),
        ...(safetySettings?.length ? { safetySettings } : {}),
        ...(generationConfig ? { generationConfig } : {}),
      };

      // 5) 头部（决定使用 x-goog-api-key 或 nk- 访问码）
      const headers = getHeaders(false, {
        model: options.config.model,
        providerName: ServiceProvider.Google,
      });
      // 6) 使用统一流式工具处理 + 思考模式

      streamWithThink(
        chatPath,
        requestPayload,
        headers,
        [] as any[],
        {},
        controller,
        // parse Google SSE
        (text: string) => {
          try {
            const json = JSON.parse(text);
            const candidates = json?.candidates;
            if (!candidates || candidates.length === 0) {
              // 某些事件可能是心跳或控制事件
              if (typeof json?.text === "string") {
                return { isThinking: false, content: json.text };
              }
              return { isThinking: false, content: "" };
            }
            const parts = candidates[0]?.content?.parts ?? [];
            for (const p of parts) {
              // 思考内容：优先识别带有 thought 标识的分片
              if ((p as any)?.thought && (p as any)?.text) {
                return { isThinking: true, content: (p as any).text };
              }
              // 退化为普通文本
              if ((p as any)?.text) {
                return { isThinking: false, content: (p as any).text };
              }
            }
            // 兼容增量字段
            if (typeof json?.text === "string") {
              return { isThinking: false, content: json.text };
            }
          } catch (e) {}
          return { isThinking: false, content: "" };
        },
        // Google 暂无工具调用的统一格式，这里不处理工具回调
        () => {},
        options,
        !!cap?.reasoning,
      );

      clearTimeout(timeoutId);
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  }

  async models(): Promise<LLMModel[]> {
    try {
      const listPath = this.path("v1beta/models");
      const res = await fetch(listPath, {
        method: "GET",
        headers: getHeaders(false, {
          providerName: ServiceProvider.Google,
          model: "",
        }),
      });
      const data = await res.json();
      const arr: any[] = data?.models || [];
      if (!Array.isArray(arr) || arr.length === 0) {
        return DEFAULT_MODELS.filter(
          (m) => m.provider.providerName === "Google",
        );
      }
      const models: LLMModel[] = arr
        .filter((m) => m?.name)
        .map((m) => ({
          name: String(m.name).replace(/^models\//, ""),
          displayName: m.displayName,
          available: true,
          provider: {
            id: "google",
            providerName: "Google",
            providerType: "google",
            sorted: 1,
          },
          sorted: 1,
          contextTokens: m.inputTokenLimit,
        }));
      return models.length
        ? models
        : DEFAULT_MODELS.filter((m) => m.provider.providerName === "Google");
    } catch {
      return DEFAULT_MODELS.filter((m) => m.provider.providerName === "Google");
    }
  }

  async speech(): Promise<ArrayBuffer> {
    throw new Error("Speech generation not implemented for Google");
  }
}
