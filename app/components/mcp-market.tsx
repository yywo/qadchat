import { IconButton } from "./button";
import { ErrorBoundary } from "./error";
import styles from "./mcp-market.module.scss";
import EditIcon from "../icons/edit.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import DeleteIcon from "../icons/delete.svg";
import RestartIcon from "../icons/reload.svg";
import EyeIcon from "../icons/eye.svg";
import TestIcon from "../icons/connection.svg";
import { List, ListItem, Modal, showToast } from "./ui-lib";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addMcpServer,
  getClientsStatus,
  getClientTools,
  getMcpConfigFromFile,
  pauseMcpServer,
  restartAllClients,
  resumeMcpServer,
  removeMcpServer,
} from "../mcp/actions";
import {
  ListToolsResponse,
  McpConfigData,
  ServerConfig,
  ServerStatusResponse,
} from "../mcp/types";
import clsx from "clsx";
import PlayIcon from "../icons/play.svg";
import StopIcon from "../icons/pause.svg";

interface ConfigProperty {
  type: string;
  description?: string;
  required?: boolean;
  minItems?: number;
}

export function McpMarketPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [userConfig, setUserConfig] = useState<Record<string, any>>({});
  const [editingServerId, setEditingServerId] = useState<string | undefined>();
  const [tools, setTools] = useState<ListToolsResponse["tools"] | null>(null);
  const [viewingServerId, setViewingServerId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<McpConfigData>();
  const [clientStatuses, setClientStatuses] = useState<
    Record<string, ServerStatusResponse>
  >({});
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, string>>(
    {},
  );
  const [testResult, setTestResult] = useState<any | null>(null);

  // 新增：自定义添加/导入 JSON 弹窗状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  // 新增：表单数据（仅 streamableHttp）
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    baseUrl: "",
    headers: "",
    longRunning: false,
    timeout: 60,
  });
  const [importJson, setImportJson] = useState("");

  // 添加状态轮询
  useEffect(() => {
    if (!config) return;

    const updateStatuses = async () => {
      const statuses = await getClientsStatus();
      setClientStatuses(statuses);
    };

    // 立即执行一次
    updateStatuses();
    // 每 1000ms 轮询一次
    const timer = setInterval(updateStatuses, 1000);

    return () => clearInterval(timer);
  }, [config]);

  // 不再加载内置预设服务器，完全由用户自定义

  // 加载初始状态
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        setIsLoading(true);
        const config = await getMcpConfigFromFile();
        setConfig(config);

        // 获取所有客户端的状态
        const statuses = await getClientsStatus();
        setClientStatuses(statuses);
      } catch (error) {
        showToast("Failed to load initial state");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialState();
  }, []);

  // 加载当前编辑服务器的配置
  useEffect(() => {
    if (!editingServerId || !config) return;
    const currentConfig = config.mcpServers[editingServerId];
    if (currentConfig) {
      setUserConfig({});
    } else {
      setUserConfig({});
    }
  }, [editingServerId, config]);

  // 检查服务器是否已添加
  const isServerAdded = (id: string) => {
    return id in (config?.mcpServers ?? {});
  };

  // 解析 headers 文本为对象（key=value 或 JSON 均可）
  function parseHeaders(input: string): Record<string, string> | undefined {
    const trimmed = (input || "").trim();
    if (!trimmed) return undefined;
    try {
      const maybeJson = JSON.parse(trimmed);
      if (maybeJson && typeof maybeJson === "object") return maybeJson;
    } catch {}
    const lines = trimmed
      .split(/\n|\r/)
      .map((l) => l.trim())
      .filter(Boolean);
    const headers: Record<string, string> = {};
    for (const line of lines) {
      const m = line.match(/^(.*?)[=:]\s*(.*)$/);
      if (m) headers[m[1].trim()] = m[2].trim();
    }
    return Object.keys(headers).length ? headers : undefined;
  }

  // 新增：保存自定义服务器（仅 streamableHttp）
  async function saveCustomServer() {
    if (!formData.id.trim() || !formData.baseUrl.trim()) {
      showToast("请填写标识与 URL");
      return;
    }
    try {
      setIsLoading(true);
      const cfg: ServerConfig = {
        type: "streamableHttp",
        baseUrl: formData.baseUrl.trim(),
        headers: parseHeaders(formData.headers),
        timeout: Math.max(
          1,
          formData.longRunning
            ? Math.max(600, formData.timeout)
            : formData.timeout,
        ),
        status: "active",
        name: formData.name?.trim() || formData.id.trim(),
        description: formData.description?.trim() || "",
      } as ServerConfig;
      const newCfg = await addMcpServer(formData.id.trim(), cfg);
      setConfig(newCfg);
      setShowAddModal(false);
      showToast("已添加 MCP 服务器");
    } catch (e) {
      showToast("添加失败，请检查配置");
    } finally {
      setIsLoading(false);
    }
  }

  // 新增：导入 JSON
  async function importFromJson() {
    try {
      setIsLoading(true);
      const obj = JSON.parse(importJson);
      const servers = (obj?.mcpServers ?? obj?.servers ?? obj) as Record<
        string,
        any
      >;
      if (!servers || typeof servers !== "object") {
        showToast("未找到 mcpServers 字段");
        return;
      }
      for (const [id, conf] of Object.entries(servers)) {
        const rawType = String((conf as any).type || "")
          .trim()
          .toLowerCase();
        // 兼容多种写法：streamablehttp / streamable_http / streamable-http
        const isStreamable = [
          "streamablehttp",
          "streamable_http",
          "streamable-http",
        ].includes(rawType);
        if (rawType && !isStreamable) continue; // 仅导入 Streamable HTTP
        const url = (conf as any).url || (conf as any).baseUrl;
        if (!url) continue;
        const headers = (conf as any).headers;
        const timeout = Number((conf as any).timeout ?? 60);
        const cfg: ServerConfig = {
          type: "streamableHttp",
          baseUrl: url,
          headers,
          timeout,
          status: "active",
          name: (conf as any).name || id,
          description: (conf as any).description || "",
          protocolVersion: (conf as any).protocolVersion,
        } as ServerConfig;
        await addMcpServer(id, cfg);
      }
      const newConfig = await getMcpConfigFromFile();
      setConfig(newConfig);
      setShowImportModal(false);
      showToast("已导入 MCP 服务器");
    } catch (e) {
      showToast("JSON 解析失败");
    } finally {
      setIsLoading(false);
    }
  }

  // 保存服务器配置 (SSE专用 - 简化版)
  const saveServerConfig = async () => {
    // 当前版本配置表单使用 Add Custom 完成，此处仅关闭弹窗
    setEditingServerId(undefined);
  };

  // 获取服务器支持的 Tools
  const loadTools = async (id: string) => {
    try {
      const result = await getClientTools(id);
      if (result) {
        setTools(result);
      } else {
        throw new Error("Failed to load tools");
      }
    } catch (error) {
      showToast("Failed to load tools");
      setTools(null);
    }
  };

  // 更新加载状态的辅助函数
  const updateLoadingState = (id: string, message: string | null) => {
    setLoadingStates((prev) => {
      if (message === null) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: message };
    });
  };

  // 已移除内置添加逻辑，改为表单/导入 JSON 两种入口

  // 修改暂停服务器函数
  const pauseServer = async (id: string) => {
    try {
      updateLoadingState(id, "Stopping server...");
      const newConfig = await pauseMcpServer(id);
      setConfig(newConfig);
      showToast("Server stopped successfully");
    } catch (error) {
      showToast("Failed to stop server");
    } finally {
      updateLoadingState(id, null);
    }
  };

  // Restart server
  const restartServer = async (id: string) => {
    try {
      updateLoadingState(id, "Starting server...");
      await resumeMcpServer(id);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to start server, please check logs",
      );
    } finally {
      updateLoadingState(id, null);
    }
  };

  // Test connection
  const testServer = async (id: string) => {
    try {
      updateLoadingState(id, "Testing...");
      const actions = await import("../mcp/actions");
      const basic = await actions.testMcpConnection(id);
      // 如果基础测试 4xx，顺带做高级诊断
      if (basic.status >= 400 && basic.status < 500) {
        const diag = await actions.diagnoseMcpConnection(id);
        setTestResult({ id, result: { basic, diag } });
      } else {
        setTestResult({ id, result: basic });
      }
    } catch (e) {
      setTestResult({ id, result: { error: String(e) } });
    } finally {
      updateLoadingState(id, null);
    }
  };

  // Restart all clients
  const handleRestartAll = async () => {
    try {
      updateLoadingState("all", "Restarting all servers...");
      const newConfig = await restartAllClients();
      setConfig(newConfig);
      showToast("Restarting all clients");
    } catch (error) {
      showToast("Failed to restart clients");
    } finally {
      updateLoadingState("all", null);
    }
  };

  // Render configuration form（占位）
  const renderConfigForm = () => null;

  const checkServerStatus = (clientId: string) => {
    return clientStatuses[clientId] || { status: "undefined", errorMsg: null };
  };

  const getServerStatusDisplay = (clientId: string) => {
    const status = checkServerStatus(clientId);

    const statusMap = {
      undefined: null, // 未配置/未找到不显示
      // 添加初始化状态
      initializing: (
        <span className={clsx(styles["server-status"], styles["initializing"])}>
          Initializing
        </span>
      ),
      paused: (
        <span className={clsx(styles["server-status"], styles["stopped"])}>
          Stopped
        </span>
      ),
      active: <span className={styles["server-status"]}>Running</span>,
      error: (
        <span className={clsx(styles["server-status"], styles["error"])}>
          Error
          <span className={styles["error-message"]}>: {status.errorMsg}</span>
        </span>
      ),
    };

    return statusMap[status.status];
  };

  // Get the type of operation status
  const getOperationStatusType = (message: string) => {
    if (message.toLowerCase().includes("stopping")) return "stopping";
    if (message.toLowerCase().includes("starting")) return "starting";
    if (message.toLowerCase().includes("error")) return "error";
    return "default";
  };

  // 渲染服务器列表
  const renderServerList = () => {
    if (loadingPresets) {
      return (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-text"]}>
            Loading preset server list...
          </div>
        </div>
      );
    }

    // 仅展示用户自定义配置的服务器
    const customFromConfig = Object.entries(config?.mcpServers ?? {}).map(
      ([id, cfg]) => ({
        id,
        name: cfg?.name || id,
        description: cfg?.description || "",
        tags: [cfg.type || "streamableHttp"],
        baseUrl: (cfg as any).baseUrl || (cfg as any).url || "",
        configurable: true,
      }),
    );
    if (customFromConfig.length === 0) {
      return (
        <div className={styles["empty-container"]}>
          <div className={styles["empty-text"]}>No servers configured</div>
        </div>
      );
    }

    const filteredServers =
      searchText.length === 0
        ? customFromConfig
        : customFromConfig.filter((s) =>
            [s.id, s.name, s.description, ...(s.tags || [])]
              .join(" ")
              .toLowerCase()
              .includes(searchText.toLowerCase()),
          );

    return filteredServers
      .sort((a, b) => {
        const aStatus = checkServerStatus(a.id).status;
        const bStatus = checkServerStatus(b.id).status;
        const aLoading = loadingStates[a.id];
        const bLoading = loadingStates[b.id];

        // 定义状态优先级
        const statusPriority: Record<string, number> = {
          error: 0, // Highest priority for error status
          active: 1, // Second for active
          initializing: 2, // Initializing
          starting: 3, // Starting
          stopping: 4, // Stopping
          paused: 5, // Paused
          undefined: 6, // Lowest priority for undefined
        };

        // Get actual status (including loading status)
        const getEffectiveStatus = (status: string, loading?: string) => {
          if (loading) {
            const operationType = getOperationStatusType(loading);
            return operationType === "default" ? status : operationType;
          }

          if (status === "initializing" && !loading) {
            return "active";
          }

          return status;
        };

        const aEffectiveStatus = getEffectiveStatus(aStatus, aLoading);
        const bEffectiveStatus = getEffectiveStatus(bStatus, bLoading);

        // 首先按状态排序
        if (aEffectiveStatus !== bEffectiveStatus) {
          return (
            (statusPriority[aEffectiveStatus] ?? 6) -
            (statusPriority[bEffectiveStatus] ?? 6)
          );
        }

        // Sort by name when statuses are the same
        return a.name.localeCompare(b.name);
      })
      .map((server) => (
        <div
          className={clsx(styles["mcp-market-item"], {
            [styles["loading"]]: loadingStates[server.id],
          })}
          key={server.id}
        >
          <div className={styles["mcp-market-header"]}>
            <div className={styles["mcp-market-title"]}>
              <div className={styles["mcp-market-name"]}>
                {server.name}
                {loadingStates[server.id] && (
                  <span
                    className={styles["operation-status"]}
                    data-status={getOperationStatusType(
                      loadingStates[server.id],
                    )}
                  >
                    {loadingStates[server.id]}
                  </span>
                )}
                {!loadingStates[server.id] && getServerStatusDisplay(server.id)}
              </div>
              <div className={styles["tags-container"]}>
                {server.tags.map((tag, index) => (
                  <span key={index} className={styles["tag"]}>
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className={clsx(styles["mcp-market-info"], "one-line")}
                title={server.description}
              >
                {server.description}
              </div>
            </div>
            <div className={styles["mcp-market-actions"]}>
              <IconButton
                icon={<EyeIcon />}
                text="Tools"
                onClick={async () => {
                  setViewingServerId(server.id);
                  await loadTools(server.id);
                }}
                disabled={
                  isLoading || checkServerStatus(server.id).status === "error"
                }
              />
              <IconButton
                icon={<TestIcon />}
                text="Test"
                onClick={() => testServer(server.id)}
                disabled={isLoading}
              />
              {checkServerStatus(server.id).status === "paused" ? (
                <IconButton
                  icon={<PlayIcon />}
                  text="Start"
                  onClick={() => restartServer(server.id)}
                  disabled={isLoading}
                />
              ) : (
                <IconButton
                  icon={<StopIcon />}
                  text="Stop"
                  onClick={() => pauseServer(server.id)}
                  disabled={isLoading}
                />
              )}
              <IconButton
                icon={<DeleteIcon />}
                text="Remove"
                onClick={() =>
                  removeMcpServer(server.id).then(async (cfg) => {
                    setConfig(cfg);
                    const s = await getClientsStatus();
                    setClientStatuses(s);
                  })
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <ErrorBoundary>
      <div className={styles["mcp-market-page"]}>
        <div className="window-header">
          <div className="window-header-title">
            <div className="window-header-main-title">
              MCP Market
              {loadingStates["all"] && (
                <span className={styles["loading-indicator"]}>
                  {loadingStates["all"]}
                </span>
              )}
            </div>
            <div className="window-header-sub-title">
              {Object.keys(config?.mcpServers ?? {}).length} servers configured
            </div>
          </div>

          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                icon={<RestartIcon />}
                bordered
                onClick={handleRestartAll}
                text="Restart All"
                disabled={isLoading}
              />
            </div>
            <div className="window-action-button">
              <IconButton
                icon={<AddIcon />}
                bordered
                onClick={() => setShowAddModal(true)}
                text="Add Custom"
                disabled={isLoading}
              />
            </div>
            <div className="window-action-button">
              <IconButton
                icon={<AddIcon />}
                bordered
                onClick={() => setShowImportModal(true)}
                text="Import JSON"
                disabled={isLoading}
              />
            </div>
            <div className="window-action-button">
              <IconButton
                icon={<CloseIcon />}
                bordered
                onClick={() => navigate(-1)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className={styles["mcp-market-page-body"]}>
          <div className={styles["mcp-market-filter"]}>
            <input
              type="text"
              className={styles["search-bar"]}
              placeholder={"Search MCP Server"}
              autoFocus
              onInput={(e) => setSearchText(e.currentTarget.value)}
            />
          </div>

          {/* 新增：添加自定义服务器（streamableHttp）*/}
          {showAddModal && (
            <div className="modal-mask">
              <Modal
                title="Add MCP Server"
                onClose={() => setShowAddModal(false)}
                actions={[
                  <IconButton
                    key="cancel"
                    text="取消"
                    onClick={() => setShowAddModal(false)}
                    bordered
                    disabled={isLoading}
                  />,
                  <IconButton
                    key="ok"
                    text="保存"
                    type="primary"
                    onClick={saveCustomServer}
                    bordered
                    disabled={isLoading}
                  />,
                ]}
              >
                <List>
                  <ListItem title="标识 (唯一)" subTitle="用于区分不同服务">
                    <input
                      value={formData.id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id: e.currentTarget.value.trim(),
                        })
                      }
                      placeholder="context7"
                    />
                  </ListItem>
                  <ListItem title="名称" subTitle="展示用名称">
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.currentTarget.value,
                        })
                      }
                      placeholder="Context7"
                    />
                  </ListItem>
                  <ListItem title="描述" subTitle="可选">
                    <input
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.currentTarget.value,
                        })
                      }
                      placeholder="文档检索/工具等"
                    />
                  </ListItem>
                  <ListItem title="类型" subTitle="仅支持 Streamable HTTP">
                    <input value="streamableHttp" disabled />
                  </ListItem>
                  <ListItem
                    title="URL"
                    subTitle="例如：https://example.com/mcp"
                  >
                    <input
                      value={formData.baseUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseUrl: e.currentTarget.value,
                        })
                      }
                      placeholder="https://host/mcp"
                    />
                  </ListItem>
                  <ListItem
                    title="请求头"
                    subTitle="key=value 或 JSON，对多行进行解析"
                  >
                    <textarea
                      value={formData.headers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          headers: e.currentTarget.value,
                        })
                      }
                      placeholder={
                        "Content-Type=application/json\nAuthorization=Bearer token"
                      }
                      rows={4}
                    />
                  </ListItem>
                  <ListItem
                    title="长时间运行模式"
                    subTitle="启用后默认超时 600s，用于支持长任务"
                  >
                    <input
                      type="checkbox"
                      checked={formData.longRunning}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          longRunning: e.target.checked,
                          timeout: e.target.checked
                            ? Math.max(600, formData.timeout)
                            : formData.timeout,
                        })
                      }
                    />
                  </ListItem>
                  <ListItem title="超时" subTitle="单位：秒">
                    <input
                      type="number"
                      min={1}
                      max={3600}
                      value={formData.timeout}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          timeout: e.currentTarget.valueAsNumber,
                        })
                      }
                    />
                  </ListItem>
                </List>
              </Modal>
            </div>
          )}

          {/* 新增：导入 JSON */}
          {showImportModal && (
            <div className="modal-mask">
              <Modal
                title="从 JSON 导入"
                onClose={() => setShowImportModal(false)}
                actions={[
                  <IconButton
                    key="cancel"
                    text="取消"
                    onClick={() => setShowImportModal(false)}
                    bordered
                    disabled={isLoading}
                  />,
                  <IconButton
                    key="ok"
                    text="确定"
                    type="primary"
                    onClick={importFromJson}
                    bordered
                    disabled={isLoading}
                  />,
                ]}
              >
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.currentTarget.value)}
                  placeholder={`// 示例 JSON (streamableHttp):\n// {\n//   "mcpServers": {\n//     "my-server": {\n//       "type": "streamableHttp",\n//       "url": "https://localhost:3001/mcp",\n//       "headers": {\n//         "Authorization": "Bearer token"\n//       }\n//     }\n//   }\n// }`}
                  rows={16}
                  style={{ width: "100%" }}
                />
              </Modal>
            </div>
          )}

          {/* 测试结果弹窗 */}
          {testResult && (
            <div className="modal-mask">
              <Modal
                title={`Test Connection - ${testResult.id}`}
                onClose={() => setTestResult(null)}
                actions={[
                  <IconButton
                    key="close"
                    text="关闭"
                    onClick={() => setTestResult(null)}
                    bordered
                  />,
                ]}
              >
                <pre
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {JSON.stringify(testResult.result, null, 2)}
                </pre>
                <div style={{ marginTop: 8, opacity: 0.7 }}>
                  如果看到 400，且错误为“request without
                  mcp-session-id...”，说明上游未识别初始化； 已使用 JSON-RPC
                  initialize（protocolVersion=2025-06-18，Accept 同时包含 json
                  与 event-stream，并附带 X-MCP-Version 头）。
                  若仍失败，请根据服务商文档补充初始化所需的额外请求头或特定协议字段。
                </div>
              </Modal>
            </div>
          )}
          <div className={styles["server-list"]}>{renderServerList()}</div>
        </div>

        {/*编辑服务器配置*/}
        {editingServerId && (
          <div className="modal-mask">
            <Modal
              title={`Configure Server - ${editingServerId}`}
              onClose={() => !isLoading && setEditingServerId(undefined)}
              actions={[
                <IconButton
                  key="cancel"
                  text="Cancel"
                  onClick={() => setEditingServerId(undefined)}
                  bordered
                  disabled={isLoading}
                />,
                <IconButton
                  key="confirm"
                  text="Save"
                  type="primary"
                  onClick={saveServerConfig}
                  bordered
                  disabled={isLoading}
                />,
              ]}
            >
              <List>{renderConfigForm()}</List>
            </Modal>
          </div>
        )}

        {viewingServerId && (
          <div className="modal-mask">
            <Modal
              title={`Server Details - ${viewingServerId}`}
              onClose={() => setViewingServerId(undefined)}
              actions={[
                <IconButton
                  key="close"
                  text="Close"
                  onClick={() => setViewingServerId(undefined)}
                  bordered
                />,
              ]}
            >
              <div className={styles["tools-list"]}>
                {isLoading ? (
                  <div>Loading...</div>
                ) : tools?.tools ? (
                  tools.tools.map(
                    (tool: ListToolsResponse["tools"], index: number) => (
                      <div key={index} className={styles["tool-item"]}>
                        <div className={styles["tool-name"]}>{tool.name}</div>
                        <div className={styles["tool-description"]}>
                          {tool.description}
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div>No tools available</div>
                )}
              </div>
            </Modal>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
