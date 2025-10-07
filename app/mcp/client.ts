import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { MCPClientLogger } from "./logger";
import { ListToolsResponse, McpRequestMessage, ServerConfig } from "./types";
import { z } from "zod";
import { createMCPClient } from "./transport-factory";
import { MCP_PROTOCOL_VERSION } from "./constants";

const logger = new MCPClientLogger();

export async function createClient(
  id: string,
  config: ServerConfig,
): Promise<Client> {
  logger.info(`Creating client for ${id}...`);

  // 使用新的传输工厂创建客户端
  const protocol = config.protocolVersion || MCP_PROTOCOL_VERSION;
  let client = await createMCPClient(id, config, protocol);
  // 尝试按 MCP 规范发送 initialize 握手（Streamable HTTP 端点通常要求）
  // 优先使用 SDK 的 initialize（由传输层正确保存 mcp-session-id）
  const initParams = {
    protocolVersion: protocol,
    clientInfo: { name: `nextchat-mcp-client-${id}`, version: "1.0.0" },
    capabilities: {},
  } as any;
  try {
    if (typeof (client as any).initialize === "function") {
      await (client as any).initialize(initParams);
    } else {
      // 兜底：手动 JSON-RPC
      const initReq = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "initialize",
        params: initParams,
      } as any;
      await (client as any).request(initReq, z.object({}).passthrough());
    }
    logger.info(`Client ${id} initialized (v=${initParams.protocolVersion})`);
  } catch (e: any) {
    // 遵循最新规范，固定使用 2025-06-18；若失败直接抛错，避免版本混乱。
    throw e;
  }

  return client;
}

export async function removeClient(client: Client) {
  logger.info(`Removing client...`);
  await client.close();
}

export async function listTools(client: Client): Promise<ListToolsResponse> {
  return client.listTools();
}

export async function executeRequest(
  client: Client,
  request: McpRequestMessage,
): Promise<any> {
  // 使用类型断言避免复杂的类型推断
  return (client as any).request(request, z.object({}).passthrough());
}
