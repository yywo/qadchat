import React from "react";
import { ServiceProvider } from "../constant";
import {
  OpenAI,
  DeepSeek,
  SiliconCloud,
  Grok,
  Claude,
  Gemini,
  Kimi,
  Qwen,
  Wenxin,
  Doubao,
  Meta,
  Ollama,
} from "@lobehub/icons";

// 导入项目自带的 SVG 图标
import BotIconDefault from "../icons/llm-icons/default.svg";
import BotIconOpenAI from "../icons/llm-icons/openai.svg";
import BotIconGemini from "../icons/llm-icons/gemini.svg";
import BotIconGemma from "../icons/llm-icons/gemma.svg";
import BotIconClaude from "../icons/llm-icons/claude.svg";
import BotIconMeta from "../icons/llm-icons/meta.svg";
import BotIconMistral from "../icons/llm-icons/mistral.svg";
import BotIconDeepseek from "../icons/llm-icons/deepseek.svg";
import BotIconMoonshot from "../icons/llm-icons/moonshot.svg";
import BotIconQwen from "../icons/llm-icons/qwen.svg";
import BotIconGrok from "../icons/llm-icons/grok.svg";
import BotIconDoubao from "../icons/llm-icons/doubao.svg";

// 根据模型名称判断应该使用的图标类型
function getModelIconType(
  provider: ServiceProvider,
  modelName?: string,
):
  | "gpt3"
  | "gpt4"
  | "o1"
  | "claude"
  | "gemini"
  | "kimi"
  | "qwen"
  | "wenxin"
  | "doubao"
  | "llama"
  | "deepseek"
  | "default" {
  if (!modelName) return "default";

  const lowerModelName = modelName.toLowerCase();

  // 跨服务商模型识别 - 优先级最高（SiliconFlow等聚合服务）
  if (lowerModelName.includes("llama")) return "llama";
  if (lowerModelName.includes("deepseek")) return "deepseek";
  if (
    lowerModelName.includes("qwen") ||
    lowerModelName.includes("qwq") ||
    lowerModelName.includes("qvq")
  )
    return "qwen";
  if (lowerModelName.includes("claude")) return "claude";
  if (lowerModelName.includes("gemini")) return "gemini";
  if (lowerModelName.includes("gpt-4") || lowerModelName.includes("chatgpt-4o"))
    return "gpt4";
  if (lowerModelName.includes("gpt-3")) return "gpt3";
  if (
    lowerModelName.includes("o1") ||
    lowerModelName.includes("o3") ||
    lowerModelName.includes("o4")
  )
    return "o1";
  // 嵌入模型的特殊处理 - 根据具体模型名称识别提供商
  if (lowerModelName.includes("embedding")) {
    // 豆包嵌入模型
    if (lowerModelName.includes("doubao")) return "doubao";
    // 阿里云Qwen嵌入模型
    if (
      lowerModelName.includes("qwen") ||
      lowerModelName.includes("text-embedding-v2")
    )
      return "qwen";
    // SiliconFlow平台的嵌入模型
    if (lowerModelName.includes("baai") || lowerModelName.includes("bge"))
      return "default";
    // OpenAI嵌入模型（默认）
    if (
      lowerModelName.includes("text-embedding") ||
      lowerModelName.includes("ada")
    )
      return "gpt4";
    // 其他嵌入模型使用默认图标
    return "default";
  }
  if (lowerModelName.includes("doubao") || lowerModelName.includes("豆包"))
    return "doubao";
  if (lowerModelName.includes("kimi") || lowerModelName.includes("moonshot"))
    return "kimi";
  if (lowerModelName.includes("wenxin") || lowerModelName.includes("文心"))
    return "wenxin";
  if (lowerModelName.includes("grok")) return "default"; // Grok 暂时使用默认图标

  // 服务商特定模型判断 - 作为后备
  if (provider === ServiceProvider.OpenAI) {
    if (
      lowerModelName.includes("o1") ||
      lowerModelName.includes("o3") ||
      lowerModelName.includes("o4")
    )
      return "o1";
    if (
      lowerModelName.includes("gpt-4") ||
      lowerModelName.includes("chatgpt-4o")
    )
      return "gpt4";
    if (lowerModelName.includes("gpt-3")) return "gpt3";
    if (
      lowerModelName.includes("text-embedding") ||
      lowerModelName.includes("embedding")
    )
      return "gpt4"; // 嵌入模型使用GPT-4图标
  }

  if (provider === ServiceProvider.Anthropic) {
    return "claude"; // Anthropic 主要提供 Claude 模型
  }

  if (provider === ServiceProvider.Google) {
    return "gemini"; // Google 主要提供 Gemini 模型
  }

  if (provider === ServiceProvider.Moonshot) {
    return "kimi"; // 月之暗面主要提供 Kimi 模型
  }

  if (provider === ServiceProvider.Alibaba) {
    return "qwen"; // 阿里云主要提供 Qwen 模型
  }

  if (provider === ServiceProvider.ByteDance) {
    return "doubao"; // 字节跳动主要提供豆包模型
  }

  if (provider === ServiceProvider.DeepSeek) {
    return "deepseek"; // DeepSeek 主要提供 DeepSeek 模型
  }

  return "default";
}

interface ProviderIconProps {
  provider: ServiceProvider | string; // 支持自定义服务商ID
  size?: number;
  modelName?: string; // 新增：模型名称，用于显示具体模型的图标
  customProviderType?: string; // 新增：自定义服务商的兼容类型
}

export function ProviderIcon({
  provider,
  size = 24,
  modelName,
  customProviderType,
}: ProviderIconProps) {
  const iconProps = { size };

  // 如果是自定义服务商，根据兼容类型确定实际的服务商类型
  let actualProvider: ServiceProvider;
  if (typeof provider === "string" && provider.startsWith("custom_")) {
    // 根据兼容类型映射到对应的内置服务商
    switch (customProviderType) {
      case "openai":
        actualProvider = ServiceProvider.OpenAI;
        break;
      case "google":
        actualProvider = ServiceProvider.Google;
        break;
      case "anthropic":
        actualProvider = ServiceProvider.Anthropic;
        break;
      default:
        actualProvider = ServiceProvider.OpenAI; // 默认使用OpenAI图标
    }
  } else {
    actualProvider = provider as ServiceProvider;
  }

  const iconType = getModelIconType(actualProvider, modelName);

  // 根据模型类型显示相应的图标
  switch (iconType) {
    case "gpt3":
      // GPT-3: 紫色背景 + 白色线条
      return (
        <OpenAI.Avatar
          {...iconProps}
          type="gpt3"
          style={{ color: "#ffffff" }}
        />
      );

    case "gpt4":
      // GPT-4: 绿色背景 + 白色线条
      return (
        <OpenAI.Avatar
          {...iconProps}
          type="gpt4"
          style={{ color: "#ffffff" }}
        />
      );

    case "o1":
      // O1: 蓝色背景 + 白色线条
      return (
        <OpenAI.Avatar {...iconProps} type="o1" style={{ color: "#ffffff" }} />
      );

    case "claude":
      return <Claude.Color {...iconProps} />;

    case "gemini":
      return <Gemini.Color {...iconProps} />;

    case "kimi":
      return <Kimi.Color {...iconProps} />;

    case "qwen":
      return <Qwen.Color {...iconProps} />;

    case "wenxin":
      return <Wenxin.Color {...iconProps} />;

    case "doubao":
      return <Doubao.Color {...iconProps} />;

    case "llama":
      return <Meta.Color {...iconProps} />;

    case "deepseek":
      return <DeepSeek.Color {...iconProps} />;

    default:
      // 如果没有具体模型信息，则根据服务商显示图标
      switch (actualProvider) {
        case ServiceProvider.OpenAI:
          // OpenAI 默认显示彩色背景 + 白色线条的 Avatar
          return <OpenAI.Avatar {...iconProps} style={{ color: "#ffffff" }} />;

        case ServiceProvider.Google:
          // Google 主要提供 Gemini 模型，显示 Gemini 彩色图标
          return <Gemini.Color {...iconProps} />;

        case ServiceProvider.Anthropic:
          // Anthropic 主要提供 Claude 模型，显示 Claude 彩色图标
          return <Claude.Color {...iconProps} />;

        case ServiceProvider.ByteDance:
          // 字节跳动主要提供豆包模型，显示豆包彩色图标
          return <Doubao.Color {...iconProps} />;

        case ServiceProvider.Alibaba:
          // 阿里云主要提供 Qwen 模型，显示 Qwen 彩色图标
          return <Qwen.Color {...iconProps} />;

        case ServiceProvider.Moonshot:
          // 月之暗面主要提供 Kimi 模型，显示 Kimi 彩色图标
          return <Kimi.Color {...iconProps} />;

        case ServiceProvider.DeepSeek:
          // DeepSeek 主要提供 DeepSeek 模型，显示 DeepSeek 彩色图标
          return <DeepSeek.Color {...iconProps} />;

        case ServiceProvider.XAI:
          // xAI 主要提供 Grok 模型，显示 Grok 图标（使用品牌色）
          return <Grok {...iconProps} style={{ color: Grok.colorPrimary }} />;

        case ServiceProvider.SiliconFlow:
          // SiliconFlow 是聚合服务，显示 SiliconCloud 彩色图标
          return <SiliconCloud.Color {...iconProps} />;

        default:
          // 返回一个通用的AI图标
          return (
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: size * 0.6,
                fontWeight: "bold",
              }}
            >
              AI
            </div>
          );
      }
  }
}

// 使用项目自带 SVG 图标的 Avatar 组件（用于模型管理器）
function ModelAvatar({
  modelName,
  size = 32,
}: {
  modelName?: string;
  size?: number;
}) {
  let LlmIcon = BotIconDefault;

  if (modelName) {
    const lowerModelName = modelName.toLowerCase();

    // 嵌入模型的特殊处理
    if (lowerModelName.includes("embedding")) {
      // 豆包嵌入模型
      if (lowerModelName.includes("doubao")) {
        LlmIcon = BotIconDoubao;
      }
      // 阿里云Qwen嵌入模型
      else if (
        lowerModelName.includes("qwen") ||
        lowerModelName.includes("text-embedding-v2")
      ) {
        LlmIcon = BotIconQwen;
      }
      // SiliconFlow平台的嵌入模型
      else if (
        lowerModelName.includes("baai") ||
        lowerModelName.includes("bge")
      ) {
        LlmIcon = BotIconDefault; // 使用默认图标
      }
      // OpenAI嵌入模型
      else if (
        lowerModelName.includes("text-embedding") ||
        lowerModelName.includes("ada")
      ) {
        LlmIcon = BotIconOpenAI;
      }
      // 其他嵌入模型使用默认图标
      else {
        LlmIcon = BotIconDefault;
      }
    }
    // 其他模型的识别逻辑
    else if (
      lowerModelName.startsWith("gpt") ||
      lowerModelName.startsWith("chatgpt") ||
      lowerModelName.startsWith("dall-e") ||
      lowerModelName.startsWith("dalle") ||
      lowerModelName.startsWith("o1") ||
      lowerModelName.startsWith("o3") ||
      lowerModelName.startsWith("o4")
    ) {
      LlmIcon = BotIconOpenAI;
    } else if (lowerModelName.startsWith("gemini")) {
      LlmIcon = BotIconGemini;
    } else if (lowerModelName.startsWith("gemma")) {
      LlmIcon = BotIconGemma;
    } else if (lowerModelName.startsWith("claude")) {
      LlmIcon = BotIconClaude;
    } else if (lowerModelName.includes("llama")) {
      LlmIcon = BotIconMeta;
    } else if (
      lowerModelName.startsWith("mixtral") ||
      lowerModelName.startsWith("codestral")
    ) {
      LlmIcon = BotIconMistral;
    } else if (lowerModelName.includes("deepseek")) {
      LlmIcon = BotIconDeepseek;
    } else if (
      lowerModelName.startsWith("moonshot") ||
      lowerModelName.startsWith("kimi")
    ) {
      LlmIcon = BotIconMoonshot;
    } else if (
      lowerModelName.startsWith("qwen") ||
      lowerModelName.startsWith("qwq") ||
      lowerModelName.startsWith("qvq")
    ) {
      LlmIcon = BotIconQwen;
    } else if (lowerModelName.startsWith("grok")) {
      LlmIcon = BotIconGrok;
    } else if (
      lowerModelName.startsWith("doubao") ||
      lowerModelName.startsWith("ep-")
    ) {
      LlmIcon = BotIconDoubao;
    }
  }

  return (
    <div className="no-dark">
      <LlmIcon width={size} height={size} />
    </div>
  );
}

// 为模型管理页面提供更大的图标，支持传入模型名称
export function ModelProviderIcon({
  provider,
  size = 32,
  modelName,
}: {
  provider: ServiceProvider | string; // 支持自定义服务商
  size?: number;
  modelName?: string;
}) {
  // 使用项目自带的 SVG 图标
  return <ModelAvatar modelName={modelName} size={size} />;
}
