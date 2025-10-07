"use client";
import {
  createClient,
  executeRequest,
  listTools,
  removeClient,
} from "./client";
import { MCPClientLogger } from "./logger";
import { MCP_PROTOCOL_VERSION, MCP_VERSION_HEADER_KEYS } from "./constants";
import type {
  McpClientData,
  McpConfigData,
  McpRequestMessage,
  ServerConfig,
  ServerStatusResponse,
} from "./types";
import {
  getMcpConfigFromStore,
  removeMcpServer as removeServerInStore,
  setMcpServer,
} from "../store/mcp";

const logger = new MCPClientLogger("MCP Actions (client)");

const clientsMap = new Map<string, McpClientData>();

export async function getClientsStatus(): Promise<
  Record<string, ServerStatusResponse>
> {
  const config = await getMcpConfigFromFile();
  const result: Record<string, ServerStatusResponse> = {};

  for (const clientId of Object.keys(config.mcpServers)) {
    const status = clientsMap.get(clientId);
    const serverConfig = config.mcpServers[clientId];

    if (!serverConfig) {
      result[clientId] = { status: "undefined", errorMsg: null };
      continue;
    }

    if (serverConfig.status === "paused") {
      result[clientId] = { status: "paused", errorMsg: null };
      continue;
    }

    if (!status) {
      result[clientId] = { status: "undefined", errorMsg: null };
      continue;
    }

    if (
      status.client === null &&
      status.tools === null &&
      status.errorMsg === null
    ) {
      result[clientId] = { status: "initializing", errorMsg: null };
      continue;
    }

    if (status.errorMsg) {
      result[clientId] = { status: "error", errorMsg: status.errorMsg };
      continue;
    }

    if (status.client) {
      result[clientId] = { status: "active", errorMsg: null };
      continue;
    }

    result[clientId] = { status: "error", errorMsg: "Client not found" };
  }

  return result;
}

export async function getClientTools(clientId: string) {
  return clientsMap.get(clientId)?.tools ?? null;
}

export async function getAvailableClientsCount() {
  let count = 0;
  clientsMap.forEach((map) => !map.errorMsg && count++);
  return count;
}

export async function getAllTools() {
  const result = [];
  for (const [clientId, status] of clientsMap.entries()) {
    result.push({ clientId, tools: status.tools });
  }
  return result;
}

// 连接测试：发送 initialize 并回传原始响应（状态/headers/body）
export async function testMcpConnection(clientId: string) {
  const cfg = (await getMcpConfigFromFile()).mcpServers[clientId];
  if (!cfg) throw new Error(`Server ${clientId} not found`);

  // 构造目标与代理头（复用与传输层相同策略）
  const origin = typeof location !== "undefined" ? location.origin : "";
  const tgt = new URL(cfg.baseUrl, origin);
  let targetUrl = cfg.baseUrl;
  const forwardHeaders: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    Accept: cfg.postAccept || "application/json, text/event-stream",
    ...Object.fromEntries(
      MCP_VERSION_HEADER_KEYS.map((k) => [
        k,
        cfg.protocolVersion || MCP_PROTOCOL_VERSION,
      ]),
    ),
    ...(cfg.headers || {}),
  };
  let requestUrl = targetUrl;
  let headers: Record<string, string> = forwardHeaders;

  if (origin && tgt.origin !== origin) {
    // 通过同源代理
    // @ts-ignore
    const b64 = btoa(
      unescape(encodeURIComponent(JSON.stringify(forwardHeaders))),
    );
    requestUrl = `/api/mcp-proxy?target=${encodeURIComponent(tgt.toString())}`;
    headers = { "x-proxy-forward-headers": b64 } as Record<string, string>;
  }

  const initBody = {
    jsonrpc: "2.0",
    id: 0,
    method: "initialize",
    params: {
      protocolVersion: cfg.protocolVersion || MCP_PROTOCOL_VERSION,
      clientInfo: { name: `nextchat-mcp-client-${clientId}`, version: "1.0.0" },
      capabilities: {},
    },
  };

  const res = await fetch(requestUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(initBody),
  });

  const rawHeaders: Record<string, string> = {};
  res.headers.forEach((v, k) => (rawHeaders[k] = v));
  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {}

  return {
    url: requestUrl,
    status: res.status,
    statusText: res.statusText,
    headers: rawHeaders,
    body: bodyText,
  };
}

// 更详细的诊断：尝试多种 Accept/Content-Type/Body 组合
export async function diagnoseMcpConnection(clientId: string) {
  const cfg = (await getMcpConfigFromFile()).mcpServers[clientId];
  if (!cfg) throw new Error(`Server ${clientId} not found`);

  const origin = typeof location !== "undefined" ? location.origin : "";
  const tgt = new URL(cfg.baseUrl, origin);

  const variants = [
    {
      name: "json+eventstream",
      accept: "application/json, text/event-stream",
      ctype: "application/json; charset=utf-8",
    },
    {
      name: "json-only",
      accept: "application/json",
      ctype: "application/json",
    },
    {
      name: "json-only-utf8",
      accept: "application/json",
      ctype: "application/json; charset=utf-8",
    },
  ];

  const run = async (variant: any) => {
    const forwardHeaders: Record<string, string> = {
      "Content-Type": variant.ctype,
      Accept: variant.accept,
      ...Object.fromEntries(
        MCP_VERSION_HEADER_KEYS.map((k) => [
          k,
          cfg.protocolVersion || MCP_PROTOCOL_VERSION,
        ]),
      ),
      ...(cfg.headers || {}),
    };
    let requestUrl = cfg.baseUrl;
    let headers: Record<string, string> = forwardHeaders;
    if (origin && tgt.origin !== origin) {
      // @ts-ignore
      const b64 = btoa(
        unescape(encodeURIComponent(JSON.stringify(forwardHeaders))),
      );
      requestUrl = `/api/mcp-proxy?target=${encodeURIComponent(tgt.toString())}`;
      headers = { "x-proxy-forward-headers": b64 } as Record<string, string>;
    }
    const initBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: cfg.protocolVersion || MCP_PROTOCOL_VERSION,
        clientInfo: {
          name: `nextchat-mcp-client-${clientId}`,
          version: "1.0.0",
        },
        capabilities: {},
      },
    };
    const res = await fetch(requestUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(initBody),
    });
    const rawHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => (rawHeaders[k] = v));
    const bodyText = await res.text();
    return {
      name: variant.name,
      status: res.status,
      statusText: res.statusText,
      headers: rawHeaders,
      body: bodyText,
    };
  };

  const results = [] as any[];
  for (const v of variants) {
    try {
      // eslint-disable-next-line no-await-in-loop
      results.push(await run(v));
    } catch (e) {
      results.push({ name: v.name, error: String(e) });
    }
  }
  // 额外测试：GET SSE 是否可用
  try {
    const forwardHeaders: Record<string, string> = {
      Accept: "text/event-stream",
      ...(cfg.headers || {}),
    };
    let requestUrl = cfg.baseUrl;
    let headers: Record<string, string> = forwardHeaders;
    if (origin && tgt.origin !== origin) {
      // @ts-ignore
      const b64 = btoa(
        unescape(encodeURIComponent(JSON.stringify(forwardHeaders))),
      );
      requestUrl = `/api/mcp-proxy?target=${encodeURIComponent(tgt.toString())}`;
      headers = { "x-proxy-forward-headers": b64 } as Record<string, string>;
    }
    const res = await fetch(requestUrl, { method: "GET", headers });
    const rawHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => (rawHeaders[k] = v));
    results.push({
      name: "sse-get",
      status: res.status,
      statusText: res.statusText,
      headers: rawHeaders,
    });
  } catch (e) {
    results.push({ name: "sse-get", error: String(e) });
  }

  return { target: cfg.baseUrl, results };
}

async function initializeSingleClient(
  clientId: string,
  serverConfig: ServerConfig,
) {
  if (serverConfig.status === "paused") {
    logger.info(`Skipping initialization for paused client [${clientId}]`);
    return;
  }

  logger.info(`Initializing client [${clientId}]...`);

  clientsMap.set(clientId, { client: null, tools: null, errorMsg: null });

  createClient(clientId, serverConfig)
    .then(async (client) => {
      const tools = await listTools(client);
      clientsMap.set(clientId, { client, tools, errorMsg: null });
      logger.success(`Client [${clientId}] initialized successfully`);
    })
    .catch((error) => {
      clientsMap.set(clientId, {
        client: null,
        tools: null,
        errorMsg: error instanceof Error ? error.message : String(error),
      });
      logger.error(`Failed to initialize client [${clientId}]: ${error}`);
    });
}

export async function initializeMcpSystem() {
  logger.info("MCP Actions starting (client)");
  try {
    if (clientsMap.size > 0) {
      logger.info("MCP system already initialized, skipping...");
      return;
    }
    const config = await getMcpConfigFromFile();
    for (const [clientId, serverConfig] of Object.entries(config.mcpServers)) {
      await initializeSingleClient(clientId, serverConfig);
    }
    return config;
  } catch (error) {
    logger.error(`Failed to initialize MCP system: ${error}`);
    throw error;
  }
}

export async function addMcpServer(clientId: string, config: ServerConfig) {
  try {
    const currentConfig = await getMcpConfigFromFile();
    const isNewServer = !(clientId in currentConfig.mcpServers);
    if (isNewServer && !config.status) config.status = "active";

    const newConfig: McpConfigData = {
      ...currentConfig,
      mcpServers: { ...currentConfig.mcpServers, [clientId]: config },
    };
    setMcpServer(clientId, config);

    if (isNewServer || config.status === "active") {
      await initializeSingleClient(clientId, config);
    }
    return newConfig;
  } catch (error) {
    logger.error(`Failed to add server [${clientId}]: ${error}`);
    throw error;
  }
}

export async function pauseMcpServer(clientId: string) {
  try {
    const currentConfig = await getMcpConfigFromFile();
    const serverConfig = currentConfig.mcpServers[clientId];
    if (!serverConfig) throw new Error(`Server ${clientId} not found`);

    setMcpServer(clientId, { ...serverConfig, status: "paused" });

    const client = clientsMap.get(clientId);
    if (client?.client) await removeClient(client.client);
    clientsMap.delete(clientId);

    return await getMcpConfigFromFile();
  } catch (error) {
    logger.error(`Failed to pause server [${clientId}]: ${error}`);
    throw error;
  }
}

export async function resumeMcpServer(clientId: string): Promise<void> {
  const currentConfig = await getMcpConfigFromFile();
  const serverConfig = currentConfig.mcpServers[clientId];
  if (!serverConfig) throw new Error(`Server ${clientId} not found`);

  try {
    const client = await createClient(clientId, serverConfig);
    const tools = await listTools(client);
    clientsMap.set(clientId, { client, tools, errorMsg: null });
    setMcpServer(clientId, { ...serverConfig, status: "active" });
  } catch (error) {
    // 标记错误状态
    clientsMap.set(clientId, {
      client: null,
      tools: null,
      errorMsg: error instanceof Error ? error.message : String(error),
    });
    setMcpServer(clientId, { ...serverConfig, status: "error" });
    throw error;
  }
}

export async function removeMcpServer(clientId: string) {
  try {
    const client = clientsMap.get(clientId);
    if (client?.client) await removeClient(client.client);
    clientsMap.delete(clientId);
    removeServerInStore(clientId);
    return await getMcpConfigFromFile();
  } catch (error) {
    logger.error(`Failed to remove server [${clientId}]: ${error}`);
    throw error;
  }
}

export async function restartAllClients() {
  logger.info("Restarting all clients (client)");
  for (const client of clientsMap.values()) {
    if (client.client) await removeClient(client.client);
  }
  clientsMap.clear();
  const config = await getMcpConfigFromFile();
  for (const [clientId, serverConfig] of Object.entries(config.mcpServers)) {
    await initializeSingleClient(clientId, serverConfig);
  }
  return config;
}

export async function executeMcpAction(
  clientId: string,
  request: McpRequestMessage,
) {
  try {
    const client = clientsMap.get(clientId);
    if (!client?.client) throw new Error(`Client ${clientId} not found`);
    logger.info(`Executing request for [${clientId}]`);
    return await executeRequest(client.client, request);
  } catch (error) {
    logger.error(`Failed to execute request for [${clientId}]: ${error}`);
    throw error;
  }
}

export async function getMcpConfigFromFile(): Promise<McpConfigData> {
  return getMcpConfigFromStore();
}
