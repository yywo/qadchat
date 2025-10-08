import { NextRequest, NextResponse } from "next/server";

function decodeBase64Json(b64: string | null): Record<string, string> | null {
  if (!b64) return null;
  try {
    // atob is available in edge runtime
    const jsonStr = new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
    );
    const obj = JSON.parse(jsonStr);
    if (obj && typeof obj === "object") return obj;
  } catch (e) {}
  return null;
}

async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const target = url.searchParams.get("target");
  if (!target) {
    return NextResponse.json({ error: "missing target" }, { status: 400 });
  }

  // Headers to forward to upstream
  const forwardHeaders = decodeBase64Json(
    req.headers.get("x-proxy-forward-headers"),
  );

  // 1) 以静态转发头为基础（如 Authorization、Accept、Content-Type、版本头等）
  const headers = new Headers(forwardHeaders || {});

  // 2) 合并“会话态/动态”头：SDK 在后续请求会注入 MCP-Session-Id 等，
  //    之前未被代理转发，导致上游认为没有会话从而报错。
  const passThroughKeys = new Set([
    "mcp-session-id",
    "mcp-protocol-version",
    "x-mcp-version",
    "last-event-id",
    // 某些 SDK/服务可能区分大小写，我们用小写比较，但设置时保持原样键名
  ]);

  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (passThroughKeys.has(lower)) {
      headers.set(key, value);
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

  try {
    // 读取完整请求体，避免某些上游对 chunked 流式请求体解析异常
    const rawBody =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text();

    const upstreamRes = await fetch(target, {
      method: req.method,
      headers,
      body: rawBody,
      redirect: "manual",
      signal: controller.signal,
    });

    const newHeaders = new Headers(upstreamRes.headers);
    newHeaders.delete("www-authenticate");
    newHeaders.delete("content-encoding");
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export const GET = handler;
export const POST = handler;

export function OPTIONS() {
  // Preflight ok (though same-origin /api shouldn't need it)
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export const runtime = "edge";
