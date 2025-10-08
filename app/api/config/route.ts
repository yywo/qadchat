import { NextResponse } from "next/server";

// 从环境变量获取配置
function getServerConfig() {
  const accessCode = process.env.ACCESS_CODE || "";

  // 各服务商环境变量配置
  const openaiApiKey = process.env.OPENAI_API_KEY || "";
  const openaiBaseUrl = process.env.OPENAI_BASE_URL || "";

  const googleApiKey = process.env.GOOGLE_API_KEY || "";
  const googleBaseUrl = process.env.GOOGLE_BASE_URL || "";

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
  const anthropicBaseUrl = process.env.ANTHROPIC_BASE_URL || "";

  const bytedanceApiKey = process.env.BYTEDANCE_API_KEY || "";
  const bytedanceBaseUrl = process.env.BYTEDANCE_BASE_URL || "";

  const alibabaApiKey = process.env.ALIBABA_API_KEY || "";
  const alibabaBaseUrl = process.env.ALIBABA_BASE_URL || "";

  const moonshotApiKey = process.env.MOONSHOT_API_KEY || "";
  const moonshotBaseUrl = process.env.MOONSHOT_BASE_URL || "";

  const deepseekApiKey = process.env.DEEPSEEK_API_KEY || "";
  const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || "";

  const xaiApiKey = process.env.XAI_API_KEY || "";
  const xaiBaseUrl = process.env.XAI_BASE_URL || "";

  const siliconflowApiKey = process.env.SILICONFLOW_API_KEY || "";
  const siliconflowBaseUrl = process.env.SILICONFLOW_BASE_URL || "";

  // 检测是否设置了任何服务商环境变量
  const hasProviderConfig = !!(
    openaiApiKey ||
    openaiBaseUrl ||
    googleApiKey ||
    googleBaseUrl ||
    anthropicApiKey ||
    anthropicBaseUrl ||
    bytedanceApiKey ||
    bytedanceBaseUrl ||
    alibabaApiKey ||
    alibabaBaseUrl ||
    moonshotApiKey ||
    moonshotBaseUrl ||
    deepseekApiKey ||
    deepseekBaseUrl ||
    xaiApiKey ||
    xaiBaseUrl ||
    siliconflowApiKey ||
    siliconflowBaseUrl
  );

  return {
    hideUserApiKey: false,
    disableGPT4: false,
    hideBalanceQuery: false,
    disableFastLink: false,
    customModels: "",
    defaultModel: "",
    visionModels: "",
    // 告诉前端是否设置了服务器端访问码（不暴露实际访问码）
    hasServerAccessCode: !!accessCode,
    // 告诉前端是否设置了服务商环境变量配置（不暴露实际配置）
    hasServerProviderConfig: hasProviderConfig,
    // 各服务商服务器配置状态
    serverProviders: {
      openai: {
        hasApiKey: !!openaiApiKey,
        hasBaseUrl: !!openaiBaseUrl,
      },
      google: {
        hasApiKey: !!googleApiKey,
        hasBaseUrl: !!googleBaseUrl,
      },
      anthropic: {
        hasApiKey: !!anthropicApiKey,
        hasBaseUrl: !!anthropicBaseUrl,
      },
      bytedance: {
        hasApiKey: !!bytedanceApiKey,
        hasBaseUrl: !!bytedanceBaseUrl,
      },
      alibaba: {
        hasApiKey: !!alibabaApiKey,
        hasBaseUrl: !!alibabaBaseUrl,
      },
      moonshot: {
        hasApiKey: !!moonshotApiKey,
        hasBaseUrl: !!moonshotBaseUrl,
      },
      deepseek: {
        hasApiKey: !!deepseekApiKey,
        hasBaseUrl: !!deepseekBaseUrl,
      },
      xai: {
        hasApiKey: !!xaiApiKey,
        hasBaseUrl: !!xaiBaseUrl,
      },
      siliconflow: {
        hasApiKey: !!siliconflowApiKey,
        hasBaseUrl: !!siliconflowBaseUrl,
      },
    },
  };
}

// 纯前端应用的默认配置
const DANGER_CONFIG = getServerConfig();

declare global {
  type DangerConfig = typeof DANGER_CONFIG;
}

async function handle() {
  return NextResponse.json(DANGER_CONFIG);
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
