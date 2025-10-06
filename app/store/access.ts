import {
  GoogleSafetySettingsThreshold,
  ServiceProvider,
  StoreKey,
  ApiPath,
  OPENAI_BASE_URL,
  ANTHROPIC_BASE_URL,
  GEMINI_BASE_URL,
  BYTEDANCE_BASE_URL,
  ALIBABA_BASE_URL,
  MOONSHOT_BASE_URL,
  DEEPSEEK_BASE_URL,
  XAI_BASE_URL,
  SILICONFLOW_BASE_URL,
} from "../constant";
import { getHeaders } from "../client/api";
import { getClientConfig } from "../config/client";
import { createPersistStore } from "../utils/store";
import { ensure } from "../utils/clone";
import { DEFAULT_CONFIG } from "./config";
import { getModelProvider } from "../utils/model";

// 自定义服务商类型定义
export type CustomProviderType = "openai" | "google" | "anthropic";

export interface CustomProvider {
  id: string; // 唯一标识符
  name: string; // 用户自定义的显示名称
  type: CustomProviderType; // 服务商类型，决定使用哪套API逻辑
  apiKey: string; // API密钥
  endpoint?: string; // 自定义端点
  // 根据类型的特定配置
  config?: {
    // OpenAI类型的特定配置
    azureApiVersion?: string;
    // Google类型的特定配置
    googleSafetySettings?: GoogleSafetySettingsThreshold;
    // Anthropic类型的特定配置
    anthropicVersion?: string;
  };
  enabled: boolean; // 是否启用
  created: number; // 创建时间戳
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const isApp = getClientConfig()?.buildMode === "export";

const DEFAULT_OPENAI_URL = isApp ? OPENAI_BASE_URL : ApiPath.OpenAI;

const DEFAULT_GOOGLE_URL = isApp ? GEMINI_BASE_URL : ApiPath.Google;

const DEFAULT_ANTHROPIC_URL = isApp ? ANTHROPIC_BASE_URL : ApiPath.Anthropic;

const DEFAULT_BYTEDANCE_URL = isApp ? BYTEDANCE_BASE_URL : ApiPath.ByteDance;

const DEFAULT_ALIBABA_URL = isApp ? ALIBABA_BASE_URL : ApiPath.Alibaba;

const DEFAULT_MOONSHOT_URL = isApp ? MOONSHOT_BASE_URL : ApiPath.Moonshot;

const DEFAULT_DEEPSEEK_URL = isApp ? DEEPSEEK_BASE_URL : ApiPath.DeepSeek;

const DEFAULT_XAI_URL = isApp ? XAI_BASE_URL : ApiPath.XAI;

const DEFAULT_SILICONFLOW_URL = isApp
  ? SILICONFLOW_BASE_URL
  : ApiPath.SiliconFlow;

const DEFAULT_ACCESS_STATE = {
  accessCode: "",
  useCustomConfig: true, // 默认启用自定义配置

  provider: ServiceProvider.OpenAI,

  // 启用的服务提供商
  enabledProviders: {
    [ServiceProvider.OpenAI]: false,
    [ServiceProvider.Azure]: false,
    [ServiceProvider.Google]: false,
    [ServiceProvider.Anthropic]: false,
    [ServiceProvider.ByteDance]: false,
    [ServiceProvider.Alibaba]: false,
    [ServiceProvider.Moonshot]: false,
    [ServiceProvider.XAI]: false,
    [ServiceProvider.DeepSeek]: false,
    [ServiceProvider.SiliconFlow]: false,
  } as Record<ServiceProvider, boolean>,

  // 每个服务商启用的模型列表（支持自定义服务商）
  enabledModels: {
    [ServiceProvider.OpenAI]: [] as string[],
    [ServiceProvider.Azure]: [] as string[],
    [ServiceProvider.Google]: [] as string[],
    [ServiceProvider.Anthropic]: [] as string[],
    [ServiceProvider.ByteDance]: [] as string[],
    [ServiceProvider.Alibaba]: [] as string[],
    [ServiceProvider.Moonshot]: [] as string[],
    [ServiceProvider.XAI]: [] as string[],
    [ServiceProvider.DeepSeek]: [] as string[],
    [ServiceProvider.SiliconFlow]: [] as string[],
  } as Record<ServiceProvider | string, string[]>,

  // 是否从API获取可用模型（每个服务商独立控制）
  fetchModelsFromAPI: {
    [ServiceProvider.OpenAI]: true,
    [ServiceProvider.Azure]: true,
    [ServiceProvider.Google]: true,
    [ServiceProvider.Anthropic]: true,
    [ServiceProvider.ByteDance]: true,
    [ServiceProvider.Alibaba]: true,
    [ServiceProvider.Moonshot]: true,
    [ServiceProvider.XAI]: true,
    [ServiceProvider.DeepSeek]: true,
    [ServiceProvider.SiliconFlow]: true,
  } as Record<ServiceProvider | string, boolean>,

  // 从API获取的模型列表缓存
  apiModelsCache: {} as Record<ServiceProvider | string, any[]>,

  // 模型获取状态
  modelsFetchStatus: {} as Record<
    ServiceProvider | string,
    "idle" | "loading" | "success" | "error"
  >,

  // openai
  openaiUrl: DEFAULT_OPENAI_URL,
  openaiApiKey: "",

  // azure
  azureUrl: "",
  azureApiKey: "",
  azureApiVersion: "2023-08-01-preview",

  // google ai studio
  googleUrl: DEFAULT_GOOGLE_URL,
  googleApiKey: "",
  googleApiVersion: "v1",
  googleSafetySettings: GoogleSafetySettingsThreshold.BLOCK_ONLY_HIGH,

  // anthropic
  anthropicUrl: DEFAULT_ANTHROPIC_URL,
  anthropicApiKey: "",
  anthropicApiVersion: "2023-06-01",

  // bytedance
  bytedanceUrl: DEFAULT_BYTEDANCE_URL,
  bytedanceApiKey: "",

  // alibaba
  alibabaUrl: DEFAULT_ALIBABA_URL,
  alibabaApiKey: "",

  // moonshot
  moonshotUrl: DEFAULT_MOONSHOT_URL,
  moonshotApiKey: "",

  // deepseek
  deepseekUrl: DEFAULT_DEEPSEEK_URL,
  deepseekApiKey: "",

  // xai
  xaiUrl: DEFAULT_XAI_URL,
  xaiApiKey: "",

  // siliconflow
  siliconflowUrl: DEFAULT_SILICONFLOW_URL,
  siliconflowApiKey: "",

  // 自定义服务商
  customProviders: [] as CustomProvider[],

  // server config
  hideUserApiKey: false,
  hideBalanceQuery: false,
  disableGPT4: false,
  disableFastLink: false,
  customModels: "",
  defaultModel: "",
  visionModels: "",

  // 是否设置了服务器端访问码
  hasServerAccessCode: false,

  // 客户端是否已通过验证
  isAuthenticated: false,

  // 是否设置了服务器端服务商配置
  hasServerProviderConfig: false,

  // 服务器端各服务商配置状态
  serverProviders: {
    openai: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    google: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    anthropic: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    azure: {
      hasApiKey: false,
      hasBaseUrl: false,
      hasApiVersion: false,
    },
    bytedance: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    alibaba: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    moonshot: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    deepseek: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    xai: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
    siliconflow: {
      hasApiKey: false,
      hasBaseUrl: false,
    },
  },

  // 服务器端配置缓存
  serverConfig: {
    openai: {
      apiKey: "",
      baseUrl: "",
    },
    google: {
      apiKey: "",
      baseUrl: "",
    },
    anthropic: {
      apiKey: "",
      baseUrl: "",
    },
    azure: {
      apiKey: "",
      baseUrl: "",
      apiVersion: "",
    },
    bytedance: {
      apiKey: "",
      baseUrl: "",
    },
    alibaba: {
      apiKey: "",
      baseUrl: "",
    },
    moonshot: {
      apiKey: "",
      baseUrl: "",
    },
    deepseek: {
      apiKey: "",
      baseUrl: "",
    },
    xai: {
      apiKey: "",
      baseUrl: "",
    },
    siliconflow: {
      apiKey: "",
      baseUrl: "",
    },
  },

  // tts config
  edgeTTSVoiceName: "zh-CN-YunxiNeural",
};

export type AccessControlStore = typeof DEFAULT_ACCESS_STATE & {
  enabledAccessControl: () => boolean;
  getVisionModels: () => string;
  edgeVoiceName: () => string;
  isValidOpenAI: () => boolean;
  getEffectiveOpenAIConfig: () => {
    apiKey: string;
    baseUrl: string;
    source: "frontend" | "server";
  } | null;
  hasValidOpenAIConfig: () => boolean;
  getEffectiveProviderConfig: (provider: string) => any;
  hasValidProviderConfig: (provider: string) => boolean;
  hasAnyValidProviderConfig: () => boolean;
  isValidAzure: () => boolean;
  isValidGoogle: () => boolean;
  isValidAnthropic: () => boolean;
  isValidByteDance: () => boolean;
  isValidAlibaba: () => boolean;
  isValidMoonshot: () => boolean;
  isValidDeepSeek: () => boolean;
  isValidXAI: () => boolean;
  isValidSiliconFlow: () => boolean;
  addCustomProvider: (
    provider: Omit<CustomProvider, "id" | "created">,
  ) => string;
  updateCustomProvider: (id: string, updates: Partial<CustomProvider>) => void;
  removeCustomProvider: (id: string) => void;
  getCustomProvider: (id: string) => CustomProvider | undefined;
  isCustomProviderNameUnique: (name: string, excludeId?: string) => boolean;
  isValidCustomProvider: (id: string) => boolean | undefined;
  verifyServerAccessCode: (accessCode: string) => Promise<boolean>;
  fetchServerConfig: (accessCode: string) => Promise<boolean>;
  isAuthorized: () => boolean;
  isAuthorizedAsync: () => Promise<boolean>;
  hasOtherValidProviders: () => boolean;
  setFetchModelsFromAPI: (provider: string, enabled: boolean) => void;
  setModelsFetchStatus: (
    provider: string,
    status: "idle" | "loading" | "success" | "error",
  ) => void;
  setApiModelsCache: (provider: string, models: any[]) => void;
  clearApiModelsCache: (provider?: string) => void;
  sanitizeEnabledModels: (
    provider: string,
    availableModels: { name: string }[],
  ) => void;
  fetch: () => void;
  updateAccessCode: (code: string) => void;
};

export const useAccessStore = createPersistStore(
  { ...DEFAULT_ACCESS_STATE },

  (set, get) => ({
    enabledAccessControl() {
      this.fetch();
      // 仅当服务器设置了访问码时启用访问控制
      return get().hasServerAccessCode;
    },
    getVisionModels() {
      this.fetch();
      return get().visionModels;
    },
    edgeVoiceName() {
      this.fetch();

      return get().edgeTTSVoiceName;
    },

    isValidOpenAI() {
      return ensure(get(), ["openaiApiKey"]);
    },

    // 获取有效的 OpenAI 配置（优先级：前端配置 > 服务器配置）
    getEffectiveOpenAIConfig() {
      const state = get();

      // 如果前端有配置，优先使用前端配置
      if (state.openaiApiKey) {
        return {
          apiKey: state.openaiApiKey,
          baseUrl: state.openaiUrl || "https://api.openai.com/v1",
          source: "frontend" as const,
        };
      }

      // 如果没有前端配置，但有服务器配置，使用服务器配置
      if (state.serverConfig.openai.apiKey) {
        return {
          apiKey: state.serverConfig.openai.apiKey,
          baseUrl:
            state.serverConfig.openai.baseUrl || "https://api.openai.com/v1",
          source: "server" as const,
        };
      }

      return null;
    },

    // 检查是否有有效的 OpenAI 配置（前端或服务器）
    hasValidOpenAIConfig() {
      return !!this.getEffectiveOpenAIConfig();
    },

    // 获取有效的服务商配置（通用方法）
    getEffectiveProviderConfig(provider: string) {
      const state = get();

      // 根据服务商类型获取前端配置
      let frontendConfig = null;
      switch (provider) {
        case "google":
          if (state.googleApiKey) {
            frontendConfig = {
              apiKey: state.googleApiKey,
              baseUrl: state.googleUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "anthropic":
          if (state.anthropicApiKey) {
            frontendConfig = {
              apiKey: state.anthropicApiKey,
              baseUrl: state.anthropicUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "azure":
          if (state.azureApiKey) {
            frontendConfig = {
              apiKey: state.azureApiKey,
              baseUrl: state.azureUrl || "",
              apiVersion: state.azureApiVersion || "",
              source: "frontend" as const,
            };
          }
          break;
        case "bytedance":
          if (state.bytedanceApiKey) {
            frontendConfig = {
              apiKey: state.bytedanceApiKey,
              baseUrl: state.bytedanceUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "alibaba":
          if (state.alibabaApiKey) {
            frontendConfig = {
              apiKey: state.alibabaApiKey,
              baseUrl: state.alibabaUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "moonshot":
          if (state.moonshotApiKey) {
            frontendConfig = {
              apiKey: state.moonshotApiKey,
              baseUrl: state.moonshotUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "deepseek":
          if (state.deepseekApiKey) {
            frontendConfig = {
              apiKey: state.deepseekApiKey,
              baseUrl: state.deepseekUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "xai":
          if (state.xaiApiKey) {
            frontendConfig = {
              apiKey: state.xaiApiKey,
              baseUrl: state.xaiUrl || "",
              source: "frontend" as const,
            };
          }
          break;
        case "siliconflow":
          if (state.siliconflowApiKey) {
            frontendConfig = {
              apiKey: state.siliconflowApiKey,
              baseUrl: state.siliconflowUrl || "",
              source: "frontend" as const,
            };
          }
          break;
      }

      // 如果有前端配置，优先使用
      if (frontendConfig) {
        return frontendConfig;
      }

      // 否则使用服务器配置
      const serverConfig =
        state.serverConfig[provider as keyof typeof state.serverConfig];
      if (serverConfig && serverConfig.apiKey) {
        return {
          ...serverConfig,
          source: "server" as const,
        };
      }

      return null;
    },

    // 检查是否有有效的服务商配置
    hasValidProviderConfig(provider: string) {
      return !!this.getEffectiveProviderConfig(provider);
    },

    // 检查是否有任何有效的服务商配置（包括服务器端配置）
    hasAnyValidProviderConfig() {
      const providers = [
        "openai",
        "google",
        "anthropic",
        "azure",
        "bytedance",
        "alibaba",
        "moonshot",
        "deepseek",
        "xai",
        "siliconflow",
      ];
      return providers.some((provider) =>
        this.hasValidProviderConfig(provider),
      );
    },

    isValidAzure() {
      return ensure(get(), ["azureUrl", "azureApiKey", "azureApiVersion"]);
    },

    isValidGoogle() {
      return ensure(get(), ["googleApiKey"]);
    },

    isValidAnthropic() {
      return ensure(get(), ["anthropicApiKey"]);
    },

    isValidByteDance() {
      return ensure(get(), ["bytedanceApiKey"]);
    },

    isValidAlibaba() {
      return ensure(get(), ["alibabaApiKey"]);
    },

    isValidMoonshot() {
      return ensure(get(), ["moonshotApiKey"]);
    },
    isValidDeepSeek() {
      return ensure(get(), ["deepseekApiKey"]);
    },

    isValidXAI() {
      return ensure(get(), ["xaiApiKey"]);
    },

    isValidSiliconFlow() {
      return ensure(get(), ["siliconflowApiKey"]);
    },

    // 自定义服务商管理方法
    addCustomProvider(provider: Omit<CustomProvider, "id" | "created">) {
      const newProvider: CustomProvider = {
        ...provider,
        id: `custom_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 11)}`,
        created: Date.now(),
      };

      set((state) => ({
        customProviders: [...state.customProviders, newProvider],
      }));

      return newProvider.id;
    },

    updateCustomProvider(id: string, updates: Partial<CustomProvider>) {
      set((state) => ({
        customProviders: state.customProviders.map((provider) =>
          provider.id === id ? { ...provider, ...updates } : provider,
        ),
      }));
    },

    removeCustomProvider(id: string) {
      set((state) => ({
        customProviders: state.customProviders.filter(
          (provider) => provider.id !== id,
        ),
      }));
    },

    getCustomProvider(id: string) {
      return get().customProviders.find((provider) => provider.id === id);
    },

    isCustomProviderNameUnique(name: string, excludeId?: string) {
      const providers = get().customProviders;
      return !providers.some(
        (provider) => provider.name === name && provider.id !== excludeId,
      );
    },

    isValidCustomProvider(id: string) {
      const provider = this.getCustomProvider(id);
      return provider && provider.enabled && !!provider.apiKey;
    },

    // 验证服务器端访问码
    async verifyServerAccessCode(accessCode: string): Promise<boolean> {
      try {
        const response = await fetch("/api/verify-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessCode }),
        });

        const result = await response.json();
        if (result.valid) {
          set({ isAuthenticated: true });
        }
        return result.valid;
      } catch (error) {
        console.error("[Access] Failed to verify access code:", error);
        return false;
      }
    },

    // 获取服务器端配置
    async fetchServerConfig(accessCode: string): Promise<boolean> {
      try {
        const response = await fetch("/api/server-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accessCode }),
        });

        const result = await response.json();
        if (result.error) {
          console.error(
            "[Access] Failed to fetch server config:",
            result.message,
          );
          return false;
        }

        // 更新服务器端配置缓存
        set((state) => ({
          ...state,
          serverConfig: result.config,
        }));

        return true;
      } catch (error) {
        console.error("[Access] Failed to fetch server config:", error);
        return false;
      }
    },

    // 检查是否有有效的访问码（服务器端验证）
    async isValidAccessCode(): Promise<boolean> {
      const state = get();
      if (!this.enabledAccessControl()) {
        return true;
      }

      if (!state.accessCode) {
        return false;
      }

      // 验证服务器端访问码
      return await this.verifyServerAccessCode(state.accessCode);
    },

    isAuthorized() {
      this.fetch();

      // if you don't have access code, you are authorized
      if (!this.enabledAccessControl()) {
        return true;
      }

      return get().isAuthenticated;
    },

    // 检查其他服务商是否有有效配置
    hasOtherValidProviders() {
      const hasValidCustomProvider = get().customProviders.some((provider) =>
        this.isValidCustomProvider(provider.id),
      );

      return (
        this.isValidOpenAI() ||
        this.isValidAzure() ||
        this.isValidGoogle() ||
        this.isValidAnthropic() ||
        this.isValidByteDance() ||
        this.isValidAlibaba() ||
        this.isValidMoonshot() ||
        this.isValidDeepSeek() ||
        this.isValidXAI() ||
        this.isValidSiliconFlow() ||
        hasValidCustomProvider
      );
    },

    // 异步版本的授权检查，支持服务器端访问码验证
    async isAuthorizedAsync(): Promise<boolean> {
      if (this.isAuthorized()) {
        return true;
      } else if (this.enabledAccessControl()) {
        const isValid = await this.verifyServerAccessCode(get().accessCode);
        return isValid;
      }
      return true;
    },

    updateAccessCode(code: string) {
      set((state) => ({
        ...state,
        accessCode: code,
        isAuthenticated: false, // 只要code变化，就重置认证状态
      }));
    },

    // 设置是否从API获取模型
    setFetchModelsFromAPI(
      provider: ServiceProvider | string,
      enabled: boolean,
    ) {
      set((state) => ({
        ...state,
        fetchModelsFromAPI: {
          ...state.fetchModelsFromAPI,
          [provider]: enabled,
        },
      }));
    },

    // 设置模型获取状态
    setModelsFetchStatus(
      provider: ServiceProvider | string,
      status: "idle" | "loading" | "success" | "error",
    ) {
      set((state) => ({
        ...state,
        modelsFetchStatus: {
          ...state.modelsFetchStatus,
          [provider]: status,
        },
      }));
    },

    // 缓存从API获取的模型
    setApiModelsCache(provider: ServiceProvider | string, models: any[]) {
      set((state) => ({
        ...state,
        apiModelsCache: {
          ...state.apiModelsCache,
          [provider]: models,
        },
      }));
    },

    // 清除模型缓存
    clearApiModelsCache(provider?: ServiceProvider | string) {
      set((state) => ({
        ...state,
        apiModelsCache: provider
          ? { ...state.apiModelsCache, [provider]: [] }
          : {},
      }));
    },

    sanitizeEnabledModels(
      provider: ServiceProvider | string,
      availableModels: { name: string }[],
    ) {
      set((state) => {
        const enabled = state.enabledModels[provider] ?? [];
        if (enabled.length === 0) {
          return state;
        }

        const availableModelNames = new Set(availableModels.map((m) => m.name));
        const newEnabledModels = enabled.filter((modelName) =>
          availableModelNames.has(modelName),
        );

        if (newEnabledModels.length === enabled.length) {
          return state;
        }

        return {
          ...state,
          enabledModels: {
            ...state.enabledModels,
            [provider]: newEnabledModels,
          },
        };
      });
    },

    fetch() {
      if (fetchState > 0 || getClientConfig()?.buildMode === "export") return;
      fetchState = 1;
      fetch("/api/config", {
        method: "post",
        body: null,
        headers: {
          ...getHeaders(),
        },
      })
        .then((res) => res.json())
        .then((res) => {
          const defaultModel = res.defaultModel ?? "";
          if (defaultModel !== "") {
            const [model, providerName] = getModelProvider(defaultModel);
            DEFAULT_CONFIG.modelConfig.model = model;
            DEFAULT_CONFIG.modelConfig.providerName = providerName as any;
          }

          return res;
        })
        .then((res: DangerConfig) => {
          // 保存当前的用户自定义配置
          const currentState = get();
          const userCustomModels = currentState.customModels;

          // 只更新服务器相关的配置，保留用户的自定义模型
          set((state) => ({
            ...state,
            ...res,
            // 保留用户的自定义模型，除非服务器明确提供了非空的自定义模型
            customModels: res.customModels || userCustomModels || "",
          }));
        })
        .catch(() => {
          console.error("[Config] failed to fetch config");
        })
        .finally(() => {
          fetchState = 2;
        });
    },
  }),
  {
    name: StoreKey.Access,
    version: 3,
    migrate(persistedState, version) {
      if (version < 2) {
        const state = persistedState as {
          token: string;
          openaiApiKey: string;
          azureApiVersion: string;
          googleApiKey: string;
        };
        state.openaiApiKey = state.token;
        state.azureApiVersion = "2023-08-01-preview";
      }

      if (version < 3) {
        // 添加自定义服务商字段
        const state = persistedState as any;
        if (!state.customProviders) {
          state.customProviders = [];
        }
      }

      return persistedState as any;
    },
  },
);
