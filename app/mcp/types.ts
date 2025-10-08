// ref: https://spec.modelcontextprotocol.io/specification/basic/messages/

import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface McpRequestMessage {
  jsonrpc?: "2.0";
  id?: string | number;
  method: "tools/call" | string;
  params?: {
    [key: string]: unknown;
  };
}

export const McpRequestMessageSchema: z.ZodType<McpRequestMessage> = z.object({
  jsonrpc: z.literal("2.0").optional(),
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.record(z.unknown()).optional(),
});

export interface McpResponseMessage {
  jsonrpc?: "2.0";
  id?: string | number;
  result?: {
    [key: string]: unknown;
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export const McpResponseMessageSchema: z.ZodType<McpResponseMessage> = z.object(
  {
    jsonrpc: z.literal("2.0").optional(),
    id: z.union([z.string(), z.number()]).optional(),
    result: z.record(z.unknown()).optional(),
    error: z
      .object({
        code: z.number(),
        message: z.string(),
        data: z.unknown().optional(),
      })
      .optional(),
  },
);

export interface McpNotifications {
  jsonrpc?: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}

export const McpNotificationsSchema: z.ZodType<McpNotifications> = z.object({
  jsonrpc: z.literal("2.0").optional(),
  method: z.string(),
  params: z.record(z.unknown()).optional(),
});

////////////
// Next Chat
////////////
export interface ListToolsResponse {
  tools: {
    name?: string;
    description?: string;
    inputSchema?: object;
    [key: string]: any;
  };
}

export type McpClientData =
  | McpActiveClient
  | McpErrorClient
  | McpInitializingClient;

interface McpInitializingClient {
  client: null;
  tools: null;
  errorMsg: null;
}

interface McpActiveClient {
  client: Client;
  tools: ListToolsResponse;
  errorMsg: null;
}

interface McpErrorClient {
  client: null;
  tools: null;
  errorMsg: string;
}

// 服务器状态类型
export type ServerStatus =
  | "undefined"
  | "active"
  | "paused"
  | "error"
  | "initializing";

export interface ServerStatusResponse {
  status: ServerStatus;
  errorMsg: string | null;
}

// MCP 传输协议类型 (网页端支持HTTP-based协议)
export type MCPTransportType = "sse" | "streamableHttp";

// MCP 服务器配置相关类型 (网页端专用 - 支持HTTP-based协议)
export interface ServerConfig {
  // 传输协议类型
  type: MCPTransportType;

  // SSE 协议配置
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number; // 超时时间（秒）
  // 可选：覆盖协议版本（默认使用最新规范 2025-06-18）
  protocolVersion?: string;
  // 可选：POST 请求的 Accept 值（有些服务端严格要求仅 application/json）
  postAccept?: string;

  // 认证配置（预留）
  // authProvider?: AuthConfig;

  // 服务器状态
  status?: "active" | "paused" | "error" | "initializing";

  // 服务器元信息
  name?: string;
  description?: string;
  provider?: string;
  providerUrl?: string;
  logoUrl?: string;
  tags?: string[];

  // 禁用的工具列表
  disabledTools?: string[];
  disabledAutoApproveTools?: string[];
}

export interface McpConfigData {
  // MCP Server 的配置
  mcpServers: Record<string, ServerConfig>;
}

export const DEFAULT_MCP_CONFIG: McpConfigData = {
  mcpServers: {},
};

// SSE传输协议配置类型 (网页端专用)
export interface SSETransportConfig {
  type: "sse";
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
  // authProvider?: AuthConfig;
}

export type AnyTransportConfig = SSETransportConfig;

// 向后兼容的类型别名
export type TransportType = MCPTransportType;

export interface PresetServer {
  // MCP Server 的唯一标识，作为最终配置文件 Json 的 key
  id: string;

  // MCP Server 的显示名称
  name: string;

  // MCP Server 的描述
  description: string;

  // MCP Server 的仓库地址
  repo: string;

  // MCP Server 的标签
  tags: string[];

  // 传输协议类型
  transportType: MCPTransportType;

  // HTTP传输协议配置 (网页端专用)
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;

  // 认证配置（预留）
  // authProvider?: AuthConfig;

  // MCP Server 是否需要配置
  configurable: boolean;

  // MCP Server 的配置 schema (预留)
  configSchema?: {
    properties: Record<
      string,
      {
        type: string;
        description?: string;
        required?: boolean;
        minItems?: number;
      }
    >;
  };
}
