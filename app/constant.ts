import { getModelContextTokens } from "./config/model-context-tokens";

export const OWNER = "MoonWeSif";
export const REPO = "qadchat";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;

export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const OPENAI_BASE_URL = "https://api.openai.com";
export const ANTHROPIC_BASE_URL = "https://api.anthropic.com";

export const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/";

export const BYTEDANCE_BASE_URL = "https://ark.cn-beijing.volces.com";

export const ALIBABA_BASE_URL = "https://dashscope.aliyuncs.com/api/";

export const MOONSHOT_BASE_URL = "https://api.moonshot.cn";

export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export const XAI_BASE_URL = "https://api.x.ai";

export const SILICONFLOW_BASE_URL = "https://api.siliconflow.cn";

export const CACHE_URL_PREFIX = "/api/cache";
export const UPLOAD_URL = `${CACHE_URL_PREFIX}/upload`;

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",

  Auth = "/auth",

  Artifacts = "/artifacts",
  SearchChat = "/search-chat",
  McpMarket = "/mcp-market",
}

export enum ApiPath {
  Cors = "",
  OpenAI = "/api/openai",
  Anthropic = "/api/anthropic",
  Google = "/api/google",
  ByteDance = "/api/bytedance",
  Alibaba = "/api/alibaba",
  Moonshot = "/api/moonshot",

  Artifacts = "/api/artifacts",
  XAI = "/api/xai",
  DeepSeek = "/api/deepseek",
  SiliconFlow = "/api/siliconflow",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",

  Mcp = "mcp-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000;
export const REQUEST_TIMEOUT_MS_FOR_THINKING = REQUEST_TIMEOUT_MS * 5;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Google = "Google",
  Anthropic = "Anthropic",
  ByteDance = "ByteDance",
  Alibaba = "Alibaba",
  Moonshot = "Moonshot",
  XAI = "XAI",
  DeepSeek = "DeepSeek",
  SiliconFlow = "SiliconFlow",
}

// Google API safety settings, see https://ai.google.dev/gemini-api/docs/safety-settings
// BLOCK_NONE will not block any content, and BLOCK_ONLY_HIGH will block only high-risk content.
export enum GoogleSafetySettingsThreshold {
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
}

export enum ModelProvider {
  GPT = "GPT",
  GeminiPro = "GeminiPro", // 现在使用官方 SDK 实现
  Claude = "Claude",
  Doubao = "Doubao",
  Qwen = "Qwen",
  Moonshot = "Moonshot",
  XAI = "XAI",
  DeepSeek = "DeepSeek",
  SiliconFlow = "SiliconFlow",
}

export const Anthropic = {
  ChatPath: "v1/messages",
  ChatPath1: "v1/complete",
  ExampleEndpoint: "https://api.anthropic.com",
  Vision: "2023-06-01",
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  SpeechPath: "v1/audio/speech",
  ImagePath: "v1/images/generations",
  ListModelPath: "v1/models",
};

export const Google = {
  ExampleEndpoint: "https://generativelanguage.googleapis.com/",
  ChatPath: (modelName: string) =>
    `v1beta/models/${modelName}:streamGenerateContent`,
};

export const ByteDance = {
  ExampleEndpoint: "https://ark.cn-beijing.volces.com/api/",
  ChatPath: "api/v3/chat/completions",
};

export const Alibaba = {
  ExampleEndpoint: ALIBABA_BASE_URL,
  ChatPath: (modelName: string) => {
    if (modelName.includes("vl") || modelName.includes("omni")) {
      return "v1/services/aigc/multimodal-generation/generation";
    }
    return `v1/services/aigc/text-generation/generation`;
  },
};

export const Moonshot = {
  ExampleEndpoint: MOONSHOT_BASE_URL,
  ChatPath: "v1/chat/completions",
};

export const DeepSeek = {
  ExampleEndpoint: DEEPSEEK_BASE_URL,
  ChatPath: "chat/completions",
  ListModelPath: "v1/models",
};

export const XAI = {
  ExampleEndpoint: XAI_BASE_URL,
  ChatPath: "v1/chat/completions",
};

export const SiliconFlow = {
  ExampleEndpoint: SILICONFLOW_BASE_URL,
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models?&sub_type=chat",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang

export const MCP_TOOLS_TEMPLATE = `
### {{ clientId }} Tools
Available tools from {{ clientId }}:
{{ tools }}

**Usage Note**: These tools are immediately available for use. When users request actions that match these tools, use them directly without asking for permission.
`;

export const MCP_SYSTEM_TEMPLATE = `
In this environment you have access to a set of tools you can use to answer the user's question. You can use one or more tools per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given task, with each tool use informed by the result of the previous tool use.

## Available Tools:
{{ MCP_TOOLS }}

## Tool Use Rules
Here are the rules you should always follow to solve your task:
1. Always use the right arguments for the tools. Never use variable names as the action arguments, use the value instead.
2. Call a tool only when needed: do not call tools if you do not need information, try to solve the task yourself.
3. If no tool call is needed, just answer the question directly.
4. Never re-do a tool call that you previously did with the exact same parameters.
5. ALWAYS USE TOOLS when they can help answer user questions - DO NOT just describe what you could do, TAKE ACTION immediately.

## Common Tool Use Triggers:
- Deployment and hosting requests (deploy, publish, upload, host, etc.)
- Documentation and information queries (search, lookup, reference, etc.)
- Content creation and management (HTML, text, files, etc.)
- System and file operations (create, read, update, delete files, etc.)
- Task automation and workflow management

Remember: Always respond in the user's language and take immediate action when tools can help. If you solve the task correctly by using the right tools, you will be highly successful!

3. HOW TO USE TOOLS:
   A. Tool Call Format:
      - Use markdown code blocks with format: \`\`\`json:mcp:{clientId}\`\`\`
      - Always include:
        * method: "tools/call"（Only this method is supported）
        * params: 
          - name: must match an available primitive name
          - arguments: required parameters for the primitive

   B. Response Format:
      - Tool responses will come as user messages
      - Format: \`\`\`json:mcp-response:{clientId}\`\`\`
      - Wait for response before making another tool call

   C. Important Rules:
      - Only use tools/call method
      - Only ONE tool call per message
      - ALWAYS TAKE ACTION instead of just describing what you could do
      - Include the correct clientId in code block language tag
      - Verify arguments match the primitive's requirements

4. INTERACTION FLOW:
   A. When user makes a request:
      - IMMEDIATELY use appropriate tool if available
      - DO NOT ask if user wants you to use the tool
      - DO NOT just describe what you could do
   B. After receiving tool response:
      - Explain results clearly
      - Take next appropriate action if needed
   C. If tools fail:
      - Explain the error
      - Try alternative approach immediately

5. EXAMPLE INTERACTION:

  good example:

   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "list_allowed_directories",
       "arguments": {}
     }
   }
   \`\`\`"


  \`\`\`json:mcp-response:filesystem
  {
  "method": "tools/call",
  "params": {
    "name": "write_file",
    "arguments": {
      "path": "/Users/river/dev/nextchat/test/joke.txt",
      "content": "为什么数学书总是感到忧伤？因为它有太多的问题。"
    }
  }
  }
\`\`\`

   follwing is the wrong! mcp json example:

   \`\`\`json:mcp:filesystem
   {
      "method": "write_file",
      "params": {
        "path": "NextChat_Information.txt",
        "content": "1"
    }
   }
   \`\`\`

   This is wrong because the method is not tools/call.
   
   \`\`\`{
  "method": "search_repositories",
  "params": {
    "query": "2oeee"
  }
}
   \`\`\`

   This is wrong because the method is not tools/call.!!!!!!!!!!!

   the right format is:
   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "write_file",
       "arguments": {
         "path": "/path/to/file.txt",
         "content": "file content"
       }
     }
   }
   \`\`\`
   
   please follow the format strictly ONLY use tools/call method!!!!!!!!!!!
   
`;

export const SUMMARIZE_MODEL = "gpt-4o-mini";
export const GEMINI_SUMMARIZE_MODEL = "gemini-pro";
export const DEEPSEEK_SUMMARIZE_MODEL = "deepseek-chat";

// MCP工具相关常量
export const MCP_TOOL_THRESHOLD = 10; // 当工具数量超过此值时使用强化提示词模式

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-turbo": "2023-12",
  "gpt-4-turbo-2024-04-09": "2023-12",
  "gpt-4-turbo-preview": "2023-12",
  "gpt-4.1": "2024-06",
  "gpt-4.1-2025-04-14": "2024-06",
  "gpt-4.1-mini": "2024-06",
  "gpt-4.1-mini-2025-04-14": "2024-06",
  "gpt-4.1-nano": "2024-06",
  "gpt-4.1-nano-2025-04-14": "2024-06",
  "gpt-4.5-preview": "2023-10",
  "gpt-4.5-preview-2025-02-27": "2023-10",
  "gpt-4o": "2023-10",
  "gpt-4o-2024-05-13": "2023-10",
  "gpt-4o-2024-08-06": "2023-10",
  "gpt-4o-2024-11-20": "2023-10",
  "chatgpt-4o-latest": "2023-10",
  "gpt-4o-mini": "2023-10",
  "gpt-4o-mini-2024-07-18": "2023-10",
  "gpt-5": "2024-08",
  "gpt-5-mini": "2024-08",
  "gpt-5-nano": "2024-08",
  "gpt-5-chat": "2024-08",
  "gpt-4-vision-preview": "2023-04",
  "o1-mini-2024-09-12": "2023-10",
  "o1-mini": "2023-10",
  "o1-preview-2024-09-12": "2023-10",
  "o1-preview": "2023-10",
  "o1-2024-12-17": "2023-10",
  o1: "2023-10",
  "o3-mini-2025-01-31": "2023-10",
  "o3-mini": "2023-10",
  "gpt-oss-120b": "2023-10",
  "gpt-oss-20b": "2023-10",
  // After improvements,
  // it's now easier to add "KnowledgeCutOffDate" instead of stupid hardcoding it, as was done previously.
  "gemini-pro": "2023-12",
  "gemini-pro-vision": "2023-12",
  "deepseek-chat": "2024-07",
  "deepseek-coder": "2024-07",
};

export const DEFAULT_TTS_ENGINE = "OpenAI-TTS";
export const DEFAULT_TTS_ENGINES = ["OpenAI-TTS", "Edge-TTS"];
export const DEFAULT_TTS_MODEL = "tts-1";
export const DEFAULT_TTS_VOICE = "alloy";
export const DEFAULT_TTS_MODELS = ["tts-1", "tts-1-hd"];
export const DEFAULT_TTS_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];

export const VISION_MODEL_REGEXES = [
  /vision/,
  /gpt-5/,
  /gpt-4o/,
  /gpt-4\.1/,
  /gpt-4-turbo(?!.*preview)/,
  /claude.*[34]/,
  /claude-3-[57]/,
  /gemini-1\.5/,
  /gemini-2\.[05]/,
  /gemini-exp/,
  /learnlm/,
  /qwen.*vl/,
  /qwen2\.5-vl/,
  /doubao.*vision/,
  /deepseek-vl/,
  /grok.*vision/,
  /^dall-e/,
  /glm-4v/,
  /vl/i,
  /o1-2024-12-17/,
  /o3/,
  /o4-mini/,
  /qvq/,
];

export const EXCLUDE_VISION_MODEL_REGEXES = [/claude-3-5-haiku-20241022/];

const openaiModels = [
  // As of July 2024, gpt-4o-mini should be used in place of gpt-3.5-turbo,
  // as it is cheaper, more capable, multimodal, and just as fast. gpt-3.5-turbo is still available for use in the API.
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-instruct",
  "gpt-4",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0613",
  "gpt-4-turbo",
  "gpt-4-turbo-preview",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-1106-preview",
  "gpt-4-0125-preview",
  "gpt-4-vision-preview",
  "gpt-4.1",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4.5-preview",
  "gpt-4.5-preview-2025-02-27",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-11-20",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "gpt-4o-mini-search-preview",
  "chatgpt-4o-latest",
  // GPT-5 系列
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5-chat",
  // 推理模型系列
  "o1-2024-12-17",
  "o1-preview",
  "o1-mini",
  "o3",
  "o3-mini",
  "o3-mini-high",
  "o4-mini",
  // OSS 模型系列
  "gpt-oss-120b",
  "gpt-oss-20b",
  // 嵌入模型
  "text-embedding-3-large",
  "text-embedding-3-small",
  "text-embedding-ada-002",
  // 图像生成
  "dall-e-3",
  "dall-e-2",
  "gpt-image-1",
];

const googleModels = [
  // Gemini 2.5 系列
  "gemini-2.5-pro-exp-03-25",
  "gemini-2.5-pro-preview-03-25",
  "gemini-2.5-pro-preview-06-05",
  "gemini-2.5-pro-preview-05-06",
  "gemini-2.5-pro",
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash-preview-05-20-nothink",
  "gemini-2.5-flash",
  "gemini-2.5-flash-image-preview",
  // Gemini 2.0 系列
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-exp",
  // LearnLM 系列
  "learnlm-1.5-pro-experimental",
  // Gemini 1.5 系列
  "gemini-1.5-pro",
  "gemini-1.5-pro-002",
  "gemini-1.5-pro-001",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-flash-001",
  "gemini-1.5-flash-8b",
  // Gemini Pro 系列
  "gemini-pro",
  // Gemma 系列
  "gemma-2-27b-it",
  "gemma-2-9b-it",
  "gemma-3-27b",
];

const anthropicModels = [
  // Claude 4.1 系列
  "claude-opus-4-1-20250805",
  // Claude 4 系列
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
  // Claude 3.7 系列
  "claude-3-7-sonnet-20250219",
  "claude-3-7-sonnet-20250219-thinking",
  // Claude 3.5 系列
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
  "claude-3-5-sonnet-20240620",
  // Claude 3 系列
  "claude-3-opus-20240229",
  "claude-3-haiku-20240307",
];

const bytedanceModels = [
  // Doubao 1.5 系列
  "doubao-1-5-vision-pro-32k-250115",
  "doubao-1-5-pro-32k-250115",
  "doubao-1-5-pro-32k-character-250228",
  "doubao-1-5-pro-256k-250115",
  "doubao-1-5-lite-32k-250115",
  "doubao-1-5-thinking-pro-m",
  "doubao-1-5-thinking-vision-pro",
  // Doubao Pro 系列
  "doubao-pro-32k-241215",
  "doubao-pro-32k-functioncall-241028",
  "doubao-pro-32k-character-241215",
  "doubao-pro-256k-241115",
  // Doubao Lite 系列
  "doubao-lite-4k-character-240828",
  "doubao-lite-32k-240828",
  "doubao-lite-32k-character-241015",
  "doubao-lite-128k-240828",
  // 视觉模型
  "doubao-vision-lite-32k-241015",
  // 嵌入模型
  "doubao-embedding-large-text-240915",
  "doubao-embedding-text-240715",
  "doubao-embedding-vision-241215",
  // DeepSeek 系列 (豆包平台)
  "deepseek-r1-250120",
  "deepseek-r1-distill-qwen-32b-250120",
  "deepseek-r1-distill-qwen-7b-250120",
  "deepseek-v3-250324",
];

const alibabaModes = [
  // Qwen 3 系列
  "qwen3-235b-a22b",
  "qwen3-235b-a22b-fp8",
  "qwen3-32b-fp8",
  "qwen3-30b-a3b-fp8",
  "qwen3-8b",
  // Qwen 2.5 系列
  "qwen2.5-72b-instruct",
  "qwen2.5-32b-instruct",
  "qwen2.5-14b-instruct",
  "qwen2.5-7b-instruct",
  "qwen2.5-coder-32b-instruct",
  // Qwen 2 系列
  "qwen2-72b-instruct",
  "qwen2-vl-72b-instruct",
  "qwen2-vl-7b-instruct",
  // 视觉模型
  "qwen2.5-vl-72b-instruct",
  "qwen-vl-plus",
  // 推理模型
  "qwq-32b-preview",
  "qwq-32b",
  "qvq-32b",
  // 服务版本 (DashScope)
  "qwen-max",
  "qwen-plus",
  "qwen-turbo",
  "qwen-coder-plus",
  "qwen3-coder-plus",
  // 嵌入模型
  "text-embedding-v2",
  "qwen3-embedding-8b",
  "qwen3-reranker-8b",
];

const moonshotModes = [
  // Kimi K2 系列
  "kimi-k2",
  "kimi-latest",
  "kimi-thinking-preview",
  // 经典版本
  "moonshot-v1-auto",
];

const deepseekModels = [
  // 官方模型
  "deepseek-chat",
  "deepseek-reasoner",
];

const xAIModes = [
  // Grok 3 系列
  "grok-3",
  "grok-3-fast",
  "grok-3-mini",
  "grok-3-mini-fast",
  // Grok 2 系列
  "grok-2-vision-1212",
  "grok-2-1212",
  "grok-vision-beta",
];

const siliconflowModels = [
  // DeepSeek 系列
  "deepseek-ai/DeepSeek-R1",
  "deepseek-ai/DeepSeek-V3",
  // Qwen 系列
  "Qwen/Qwen2.5-7B-Instruct",
  "Qwen/Qwen3-8B",
  // 嵌入模型
  "BAAI/bge-m3",
  // 图像生成
  "Kwai-Kolors/Kolors",
];

let seq = 1000; // 内置的模型序号生成器从1000开始
export const DEFAULT_MODELS = [
  ...openaiModels.map((name) => ({
    name,
    available: true,
    sorted: seq++, // Global sequence sort(index)
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "openai",
      providerName: "OpenAI",
      providerType: "openai",
      sorted: 1, // 这里是固定的，确保顺序与之前内置的版本一致
    },
  })),
  ...googleModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "google",
      providerName: "Google",
      providerType: "google",
      sorted: 2,
    },
  })),
  ...anthropicModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "anthropic",
      providerName: "Anthropic",
      providerType: "anthropic",
      sorted: 3,
    },
  })),
  ...bytedanceModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "bytedance",
      providerName: "ByteDance",
      providerType: "bytedance",
      sorted: 4,
    },
  })),
  ...alibabaModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "alibaba",
      providerName: "Alibaba",
      providerType: "alibaba",
      sorted: 5,
    },
  })),
  ...moonshotModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "moonshot",
      providerName: "Moonshot",
      providerType: "moonshot",
      sorted: 6,
    },
  })),
  ...xAIModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "xai",
      providerName: "XAI",
      providerType: "xai",
      sorted: 7,
    },
  })),
  ...deepseekModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "deepseek",
      providerName: "DeepSeek",
      providerType: "deepseek",
      sorted: 8,
    },
  })),
  ...siliconflowModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    contextTokens: getModelContextTokens(name)?.contextTokens,
    provider: {
      id: "siliconflow",
      providerName: "SiliconFlow",
      providerType: "siliconflow",
      sorted: 9,
    },
  })),
] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// some famous webdav endpoints (server-side route will merge with env allowlist)
export const internalAllowedWebDavEndpoints = [
  "https://dav.jianguoyun.com/dav/",
  "https://dav.dropdav.com/",
  "https://dav.box.com/dav",
  "https://nanao.teracloud.jp/dav/",
  "https://bora.teracloud.jp/dav/",
  "https://webdav.4shared.com/",
  "https://dav.idrivesync.com",
  "https://webdav.yandex.com",
  "https://app.koofr.net/dav/Koofr",
];

export const DEFAULT_GA_ID = "G-89WN60ZK2E";

export const SAAS_CHAT_URL = "https://github.com/MoonWeSif/qadchat";
export const SAAS_CHAT_UTM_URL =
  "https://github.com/MoonWeSif/qadchat?utm_source=github";
