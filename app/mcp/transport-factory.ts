import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { MCPClientLogger } from "./logger";
import { ServerConfig } from "./types";
import { MCP_PROTOCOL_VERSION, MCP_VERSION_HEADER_KEYS } from "./constants";

const logger = new MCPClientLogger("Transport Factory");

// 网页端支持HTTP-based传输
export type MCPTransport = SSEClientTransport | StreamableHTTPClientTransport;

/**
 * 传输工厂类，负责根据配置创建相应的传输实例
 */
export class TransportFactory {
  /**
   * 根据配置创建传输实例 (网页端专用 - 支持HTTP-based协议)
   */
  static async createTransport(
    id: string,
    config: ServerConfig,
    protocolVersion: string = MCP_PROTOCOL_VERSION,
  ): Promise<MCPTransport> {
    logger.info(`Creating ${config.type} transport for ${id}...`);

    switch (config.type) {
      case "sse":
        return this.createSSETransport(
          id,
          config,
          config.protocolVersion || protocolVersion,
        );

      case "streamableHttp":
        return this.createStreamableHTTPTransport(
          id,
          config,
          config.protocolVersion || protocolVersion,
        );

      default:
        throw new Error(
          `Unsupported transport type: ${config.type}. Supported types: sse, streamableHttp`,
        );
    }
  }

  /**
   * 创建 SSE 传输
   */
  private static createSSETransport(
    id: string,
    config: ServerConfig,
    protocolVersion: string,
  ): SSEClientTransport {
    if (!config.baseUrl) {
      throw new Error(`Base URL is required for SSE transport`);
    }

    logger.debug(`Creating SSE transport with URL: ${config.baseUrl}`);

    const options = {
      eventSourceInit: {
        fetch: async (url: string | URL | Request, init?: RequestInit) => {
          let headers: Record<string, string> = {
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
            ...Object.fromEntries(
              MCP_VERSION_HEADER_KEYS.map((k) => [k, protocolVersion]),
            ),
            ...(config.headers || {}),
          };

          // 合并init中的headers
          if (init?.headers) {
            const initHeaders = init.headers;
            if (initHeaders instanceof Headers) {
              initHeaders.forEach((value, key) => {
                headers[key] = value;
              });
            } else if (Array.isArray(initHeaders)) {
              initHeaders.forEach(([key, value]) => {
                headers[key] = value;
              });
            } else {
              Object.assign(headers, initHeaders);
            }
          }

          // Headers are already set above

          // 添加超时支持
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => {
              controller.abort();
            },
            (config.timeout || 30) * 1000,
          );

          try {
            const response = await fetch(url, {
              ...init,
              headers,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(
                `SSE request failed: ${response.status} ${response.statusText}`,
              );
            }

            return response;
          } catch (error) {
            clearTimeout(timeoutId);
            throw error;
          }
        },
      },
      requestInit: {
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(
            MCP_VERSION_HEADER_KEYS.map((k) => [k, protocolVersion]),
          ),
          ...(config.headers || {}),
        },
      },
    };

    return new SSEClientTransport(new URL(config.baseUrl), options);
  }

  /**
   * 创建 StreamableHTTP 传输
   */
  private static createStreamableHTTPTransport(
    _id: string,
    config: ServerConfig,
    protocolVersion: string,
  ): StreamableHTTPClientTransport {
    if (!config.baseUrl) {
      throw new Error(`Base URL is required for StreamableHTTP transport`);
    }

    logger.debug(
      `Creating StreamableHTTP transport with URL: ${config.baseUrl}`,
    );

    const defaultAccept = "application/json, text/event-stream";
    let headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
      // Streamable HTTP 要求客户端同时能接受 json 与 event-stream
      Accept: config.postAccept || defaultAccept,
      // 在 HTTP 层也带上协议版本（覆盖常见命名）
      ...Object.fromEntries(
        MCP_VERSION_HEADER_KEYS.map((k) => [k, protocolVersion]),
      ),
      ...(config.headers || {}),
    };

    // 在浏览器端：若目标为跨域，则通过同源代理避免 CORS
    let effectiveUrl = config.baseUrl;
    try {
      // @ts-ignore
      const origin = typeof location !== "undefined" ? location.origin : "";
      const tgt = new URL(config.baseUrl, origin);
      if (origin && tgt.origin !== origin) {
        const forward: Record<string, string> = {
          "Content-Type": "application/json; charset=utf-8",
          Accept: config.postAccept || defaultAccept,
          ...Object.fromEntries(
            MCP_VERSION_HEADER_KEYS.map((k) => [k, protocolVersion]),
          ),
          ...(config.headers || {}),
        };
        // base64 编码 JSON 头部，供代理转发使用
        // @ts-ignore
        const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(forward))));
        effectiveUrl = `/api/mcp-proxy?target=${encodeURIComponent(tgt.toString())}`;
        headers = {
          // 发送到代理的自有头部（由代理再转发到上游）
          "x-proxy-forward-headers": b64,
          // 其他头部由代理注入，无需在此携带 Authorization 等到同源端
        } as Record<string, string>;
      }
    } catch (e) {}

    const options = {
      requestInit: {
        headers,
        signal: AbortSignal.timeout((config.timeout || 30) * 1000),
      },
    };

    const base =
      typeof location !== "undefined"
        ? location.origin
        : "http://localhost:3000";
    return new StreamableHTTPClientTransport(
      new URL(effectiveUrl, base),
      options,
    );
  }

  /**
   * 验证传输配置 (网页端专用)
   */
  static validateConfig(config: ServerConfig): void {
    switch (config.type) {
      case "sse":
      case "streamableHttp":
        if (!config.baseUrl) {
          throw new Error(`Base URL is required for ${config.type} transport`);
        }
        try {
          new URL(config.baseUrl);
        } catch (error) {
          throw new Error(`Invalid base URL: ${config.baseUrl}`);
        }
        break;

      default:
        throw new Error(`Unsupported transport type: ${config.type}`);
    }
  }
}

/**
 * 创建 MCP 客户端 (网页端专用)
 */
export async function createMCPClient(
  id: string,
  config: ServerConfig,
  protocolVersion: string = MCP_PROTOCOL_VERSION,
): Promise<Client> {
  // 验证配置
  TransportFactory.validateConfig(config);

  // 创建SSE传输
  const transport = await TransportFactory.createTransport(
    id,
    config,
    protocolVersion,
  );

  // 创建客户端
  const client = new Client(
    {
      name: `nextchat-mcp-client-${id}`,
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );

  // 连接传输
  await client.connect(transport);

  const transportName = (transport as any)?.constructor?.name || "transport";
  logger.success(`Client ${id} connected successfully using ${transportName}`);

  return client;
}
