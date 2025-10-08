export const MCP_PROTOCOL_VERSION = "2025-06-18";

// 按新->旧降序排列，必要时可回退
export const MCP_FALLBACK_VERSIONS = ["2025-03-26", "2024-11-05", "2024-10-07"];

// 兼容可能的服务端头名差异（大小写/命名差异）
export const MCP_VERSION_HEADER_KEYS = [
  "X-MCP-Version",
  "x-mcp-version",
  "MCP-Protocol-Version",
  "Mcp-Protocol-Version",
  "mcp-protocol-version",
  "mcp-version",
];
