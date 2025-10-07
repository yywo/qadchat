import { NextRequest, NextResponse } from "next/server";

// 获取服务器端配置的API端点（需要访问码验证）
async function handle(req: NextRequest) {
  try {
    const { accessCode } = await req.json();
    const serverAccessCode = process.env.ACCESS_CODE || "";

    // 验证访问码
    if (serverAccessCode && accessCode !== serverAccessCode) {
      return NextResponse.json(
        {
          error: true,
          message: "访问码错误",
        },
        { status: 401 },
      );
    }

    // 返回服务器端配置
    const config = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
        baseUrl: process.env.OPENAI_BASE_URL || "",
      },
      google: {
        apiKey: process.env.GOOGLE_API_KEY || "",
        baseUrl: process.env.GOOGLE_BASE_URL || "",
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || "",
        baseUrl: process.env.ANTHROPIC_BASE_URL || "",
      },
      bytedance: {
        apiKey: process.env.BYTEDANCE_API_KEY || "",
        baseUrl: process.env.BYTEDANCE_BASE_URL || "",
      },
      alibaba: {
        apiKey: process.env.ALIBABA_API_KEY || "",
        baseUrl: process.env.ALIBABA_BASE_URL || "",
      },
      moonshot: {
        apiKey: process.env.MOONSHOT_API_KEY || "",
        baseUrl: process.env.MOONSHOT_BASE_URL || "",
      },
      deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || "",
        baseUrl: process.env.DEEPSEEK_BASE_URL || "",
      },
      xai: {
        apiKey: process.env.XAI_API_KEY || "",
        baseUrl: process.env.XAI_BASE_URL || "",
      },
      siliconflow: {
        apiKey: process.env.SILICONFLOW_API_KEY || "",
        baseUrl: process.env.SILICONFLOW_BASE_URL || "",
      },
    };

    return NextResponse.json({
      error: false,
      config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: "请求格式错误",
      },
      { status: 400 },
    );
  }
}

export const POST = handle;
export const runtime = "edge";
