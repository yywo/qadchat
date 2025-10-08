import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { ApiPath, GEMINI_BASE_URL, ModelProvider } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";

export async function handle(
  req: NextRequest,
  { params }: { params: { provider: string; path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.GeminiPro);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  // 获取API密钥（优先使用服务器配置）
  let apiKey = "";
  if (authResult.useServerConfig) {
    apiKey = process.env.GOOGLE_API_KEY || "";
  } else {
    const bearToken =
      req.headers.get("x-goog-api-key") ||
      req.headers.get("Authorization") ||
      "";
    apiKey = bearToken.trim().replaceAll("Bearer ", "").trim();
  }

  try {
    const response = await request(req, apiKey, authResult.useServerConfig);
    return response;
  } catch (e) {
    console.error("[Google] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
export const preferredRegion = [
  "bom1",
  "cle1",
  "cpt1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];

async function request(
  req: NextRequest,
  apiKey: string,
  useServerConfig?: boolean,
) {
  const controller = new AbortController();

  let baseUrl = useServerConfig
    ? process.env.GOOGLE_BASE_URL || GEMINI_BASE_URL
    : GEMINI_BASE_URL;

  let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.Google, "");

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const url = new URL(`${baseUrl}${path}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
  if (req?.nextUrl?.searchParams?.get("alt") === "sse") {
    url.searchParams.set("alt", "sse");
  }
  const fetchUrl = url.toString();

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      // 统一使用解析后的 apiKey（当使用服务器配置时来自环境变量，否则来自用户请求）
      "x-goog-api-key": apiKey || "",
    },
    method: req.method,
    body: req.body,
    // to fix #2485: https://stackoverflow.com/questions/55920957/cloudflare-worker-typeerror-one-time-use-body
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  try {
    const res = await fetch(fetchUrl, fetchOptions);
    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
