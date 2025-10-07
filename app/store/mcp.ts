"use client";
import { createPersistStore } from "../utils/store";
import { StoreKey } from "../constant";
import type { ServerConfig, McpConfigData } from "../mcp/types";

export type McpStoreState = {
  servers: Record<string, ServerConfig>;
};

export const useMcpStore = createPersistStore(
  {
    servers: {} as Record<string, ServerConfig>,
  },
  (set, get) => ({}) as any,
  {
    name: StoreKey.Mcp,
    version: 1,
  },
);

// Helper functions
export function getMcpConfigFromStore(): McpConfigData {
  const servers = useMcpStore.getState().servers || {};
  return { mcpServers: servers };
}

export function setMcpServer(id: string, config: ServerConfig) {
  const prev = useMcpStore.getState().servers || {};
  useMcpStore.setState({ servers: { ...prev, [id]: config } });
}

export function removeMcpServer(id: string) {
  const next = { ...useMcpStore.getState().servers };
  delete next[id];
  useMcpStore.setState({ servers: next });
}
