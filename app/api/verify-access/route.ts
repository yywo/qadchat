import { NextRequest, NextResponse } from "next/server";

// 验证访问码的API端点
async function handle(req: NextRequest) {
  try {
    const { accessCode } = await req.json();
    const serverAccessCode = process.env.ACCESS_CODE || "";

    // 如果没有设置服务器端访问码，则不需要验证
    if (!serverAccessCode) {
      return NextResponse.json({
        valid: true,
        message: "访问码验证已禁用",
      });
    }

    // 验证访问码
    const isValid = accessCode === serverAccessCode;

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "访问码验证成功" : "访问码错误",
    });
  } catch (error) {
    return NextResponse.json(
      {
        valid: false,
        message: "验证请求格式错误",
      },
      { status: 400 },
    );
  }
}

export const POST = handle;
export const runtime = "edge";
