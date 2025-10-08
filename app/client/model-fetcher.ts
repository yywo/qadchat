import { ServiceProvider } from "../constant";
import { useAccessStore } from "../store/access";
import { LLMModel } from "./api";
import { getHeaders, getClientApi } from "./api";

// 统一的模型响应接口
export interface ModelFetchResponse {
  models: LLMModel[];
  success: boolean;
  error?: string;
}

// OpenAI格式的模型响应
interface OpenAIModelResponse {
  object: string;
  data: Array<{
    id: string;
    object: string;
    owned_by?: string;
    created?: number;
  }>;
}

// Anthropic格式的模型响应
interface AnthropicModelResponse {
  data: Array<{
    id: string;
    display_name: string;
    created_at: string;
    type: string;
  }>;
  has_more: boolean;
  first_id?: string;
  last_id?: string;
}

// Google格式的模型响应（基于官方API）
interface GoogleModelResponse {
  models: Array<{
    name: string;
    baseModelId: string;
    version: string;
    displayName: string;
    description?: string;
    supportedGenerationMethods?: string[];
    inputTokenLimit?: number;
    outputTokenLimit?: number;
  }>;
  nextPageToken?: string;
}

/**
 * 统一的模型获取服务
 */
export class ModelFetcher {
  /**
   * 从指定服务商获取可用模型列表
   */
  static async fetchModels(
    provider: ServiceProvider | string,
  ): Promise<ModelFetchResponse> {
    try {
      const accessStore = useAccessStore.getState();

      switch (provider) {
        case ServiceProvider.OpenAI:
          return await this.fetchOpenAIModels(ServiceProvider.OpenAI);

        case ServiceProvider.Anthropic:
          return await this.fetchAnthropicModels();

        case ServiceProvider.Google:
          return await this.fetchGoogleModels();

        case ServiceProvider.DeepSeek:
          return await this.fetchDeepSeekModels();

        case ServiceProvider.Moonshot:
          return await this.fetchMoonshotModels();

        case ServiceProvider.ByteDance:
          return await this.fetchByteDanceModels();

        case ServiceProvider.Alibaba:
          return await this.fetchAlibabaModels();

        case ServiceProvider.XAI:
          return await this.fetchXAIModels();

        case ServiceProvider.SiliconFlow:
          return await this.fetchSiliconFlowModels();

        default:
          // 处理自定义服务商
          if (typeof provider === "string" && provider.startsWith("custom_")) {
            const customProvider = accessStore.customProviders.find(
              (p) => p.id === provider,
            );
            if (customProvider) {
              return await this.fetchCustomProviderModels(customProvider);
            }
          }

          return {
            models: [],
            success: false,
            error: `不支持的服务商: ${provider}`,
          };
      }
    } catch (error) {
      console.error(`[ModelFetcher] 获取 ${provider} 模型失败:`, error);
      return {
        models: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 获取OpenAI格式的模型（OpenAI、Moonshot、ByteDance等）
   */
  private static async fetchOpenAIModels(
    provider: ServiceProvider,
  ): Promise<ModelFetchResponse> {
    const api = getClientApi(provider);
    try {
      const models = await api.llm.models();
      return {
        models,
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        models: [],
        success: false,
        error: `${provider}模型列表获取失败。\n\n错误详情: ${errorMessage}\n\n如果问题持续存在，建议使用内置模型列表。`,
      };
    }
  }

  /**
   * 获取Anthropic模型
   * 注意：Anthropic目前没有公开的模型列表API，尝试使用OpenAI兼容格式
   */
  private static async fetchAnthropicModels(): Promise<ModelFetchResponse> {
    const api = getClientApi(ServiceProvider.Anthropic);
    try {
      const models = await api.llm.models();
      return {
        models,
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        models: [],
        success: false,
        error: `Anthropic模型列表获取失败。\n\n错误详情: ${errorMessage}\n\n如果问题持续存在，建议使用内置模型列表。`,
      };
    }
  }

  /**
   * 获取Google模型
   * 使用Google Generative Language API的正确端点
   */
  private static async fetchGoogleModels(): Promise<ModelFetchResponse> {
    const api = getClientApi(ServiceProvider.Google);
    try {
      const models = await api.llm.models();
      return {
        models,
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        models: [],
        success: false,
        error: `Google模型列表获取失败。\n\n错误详情: ${errorMessage}\n\n如果问题持续存在，建议使用内置模型列表。`,
      };
    }
  }

  /**
   * 获取DeepSeek模型
   * 使用DeepSeek官方API端点
   */
  private static async fetchDeepSeekModels(): Promise<ModelFetchResponse> {
    const api = getClientApi(ServiceProvider.DeepSeek);
    try {
      const models = await api.llm.models();
      return {
        models,
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        models: [],
        success: false,
        error: `DeepSeek模型列表获取失败。\n\n错误详情: ${errorMessage}\n\n如果问题持续存在，建议使用内置模型列表。`,
      };
    }
  }

  /**
   * 获取Moonshot模型（兼容OpenAI格式）
   */
  private static async fetchMoonshotModels(): Promise<ModelFetchResponse> {
    return await this.fetchOpenAICompatibleModels(ServiceProvider.Moonshot);
  }

  /**
   * 获取ByteDance模型（兼容OpenAI格式）
   */
  private static async fetchByteDanceModels(): Promise<ModelFetchResponse> {
    return await this.fetchOpenAICompatibleModels(ServiceProvider.ByteDance);
  }

  /**
   * 获取Alibaba模型（兼容OpenAI格式）
   */
  private static async fetchAlibabaModels(): Promise<ModelFetchResponse> {
    return await this.fetchOpenAICompatibleModels(ServiceProvider.Alibaba);
  }

  /**
   * 获取XAI模型（兼容OpenAI格式）
   */
  private static async fetchXAIModels(): Promise<ModelFetchResponse> {
    return await this.fetchOpenAICompatibleModels(ServiceProvider.XAI);
  }

  /**
   * 获取SiliconFlow模型（兼容OpenAI格式）
   */
  private static async fetchSiliconFlowModels(): Promise<ModelFetchResponse> {
    return await this.fetchOpenAICompatibleModels(ServiceProvider.SiliconFlow);
  }

  /**
   * 通用的OpenAI兼容格式模型获取
   */
  private static async fetchOpenAICompatibleModels(
    provider: ServiceProvider,
  ): Promise<ModelFetchResponse> {
    const api = getClientApi(provider);
    try {
      const models = await api.llm.models();
      return {
        models,
        success: true,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        models: [],
        success: false,
        error: `${provider}模型列表获取失败。\n\n错误详情: ${errorMessage}\n\n如果问题持续存在，建议使用内置模型列表。`,
      };
    }
  }

  /**
   * 获取自定义服务商模型
   */
  private static async fetchCustomProviderModels(
    customProvider: any,
  ): Promise<ModelFetchResponse> {
    // 根据自定义服务商的类型调用相应的方法
    switch (customProvider.type) {
      case "openai":
        return await this.fetchOpenAIModels(ServiceProvider.OpenAI);

      case "anthropic":
        return await this.fetchAnthropicModels();

      case "google":
        return await this.fetchGoogleModels();

      default:
        return {
          models: [],
          success: false,
          error: `不支持的自定义服务商类型: ${customProvider.type}`,
        };
    }
  }
}
