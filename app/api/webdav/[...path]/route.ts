import { NextRequest, NextResponse } from "next/server";
import { STORAGE_KEY, internalAllowedWebDavEndpoints } from "../../../constant";

// Merge internal allowlist with server-provided env list (server-side only)
function getAllowedWebDavEndpoints() {
  const raw = process.env.WHITE_WEBDAV_ENDPOINTS ?? "";
  const extra = raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      try {
        const u = new URL(s);
        if (u.protocol !== "https:") return null; // enforce https
        if (!u.pathname.endsWith("/")) u.pathname += "/"; // normalize
        return `${u.origin}${u.pathname}`;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];

  const normalizedInternal = internalAllowedWebDavEndpoints
    .map((s) => {
      try {
        const u = new URL(s);
        if (!u.pathname.endsWith("/")) u.pathname += "/";
        return `${u.origin}${u.pathname}`;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];

  return Array.from(new Set([...normalizedInternal, ...extra]));
}

const mergedAllowedWebDavEndpoints = getAllowedWebDavEndpoints();

const normalizeUrl = (url: string) => {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
};

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const folder = STORAGE_KEY;
  const fileName = `${folder}/backup.json`;

  const requestUrl = new URL(req.url);
  let endpoint = requestUrl.searchParams.get("endpoint");
  let proxy_method = requestUrl.searchParams.get("proxy_method") || req.method;

  // Validate the endpoint to prevent potential SSRF attacks
  if (
    !endpoint ||
    !mergedAllowedWebDavEndpoints.some((allowedEndpoint) => {
      const normalizedAllowedEndpoint = normalizeUrl(allowedEndpoint);
      const normalizedEndpoint = normalizeUrl(endpoint as string);

      return (
        normalizedEndpoint &&
        normalizedEndpoint.protocol === "https:" &&
        normalizedEndpoint.hostname === normalizedAllowedEndpoint?.hostname &&
        normalizedEndpoint.pathname.startsWith(
          normalizedAllowedEndpoint.pathname,
        )
      );
    })
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "Invalid endpoint",
      },
      {
        status: 400,
      },
    );
  }

  if (!endpoint?.endsWith("/")) {
    endpoint += "/";
  }

  const endpointPath = params.path.join("/");
  const targetPath = `${endpoint}${endpointPath}`;

  // only allow MKCOL, GET, PUT
  if (
    proxy_method !== "MKCOL" &&
    proxy_method !== "GET" &&
    proxy_method !== "PUT"
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  // for MKCOL request, only allow request ${folder}
  if (proxy_method === "MKCOL" && !targetPath.endsWith(folder)) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  // for GET request, only allow request ending with fileName
  if (proxy_method === "GET" && !targetPath.endsWith(fileName)) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  //   for PUT request, only allow request ending with fileName
  if (proxy_method === "PUT" && !targetPath.endsWith(fileName)) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }

  const targetUrl = targetPath;

  const method = proxy_method || req.method;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    redirect: "manual",
    method,
    // @ts-ignore
    duplex: "half",
  };

  let fetchResult;

  try {
    fetchResult = await fetch(targetUrl, fetchOptions);
  } finally {
    console.log(
      "[Any Proxy]",
      targetUrl,
      {
        method: method,
      },
      {
        status: fetchResult?.status,
        statusText: fetchResult?.statusText,
      },
    );
  }

  return fetchResult;
}

export const PUT = handle;
export const GET = handle;
export const OPTIONS = handle;

export const runtime = "edge";
