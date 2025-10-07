# QADChat v2.17.5

**QADChat 为基于项目 [NextChat](https://github.com/ChatGPTNextWeb/NextChat) 的改造版本, 由 v2.16.0 版本 clone 后进行二次开发**

**包含部分 UI 重构，使用逻辑重构，无用模块移除、全新功能模块**

## 补充说明

由于原Github账号不明原因被封禁，故使用新仓库进行存储，本仓库为 QADChat 新的官方仓库，谢谢🙏

## 开始使用

### 部署说明

#### 环境变量配置

支持通过环境变量配置所有主要AI服务商的API密钥和Base URL，并配置访问码，请参考 [.env.example](.env.example) 文件。

#### Docker 部署(推荐)

1. git clone https://github.com/MoonWeSif/qadchat.git
2. cd qadchat
3. docker-compose up -d

#### Vercel 一键部署(推荐)

点击[https://vercel.com/new/clone?repository-url=https://github.com/MoonWeSif/qadchat](https://vercel.com/new/clone?repository-url=https://github.com/MoonWeSif/qadchat)

### Demo站点

点击[https://qaduck.com](https://qaduck.com)

## QADChat 版本特点

### 架构重构

- 将话题与助手(原名为“面具”)绑定，每个助手下的都拥有独立的话题列表，通过切换不同的助手，可以在该助手下快速创建话题。
  即原先整体架构为，话题-消息。该版本重构为助手-话题-消息。
  此重构有助于区分不同助手下的话题，避免所有话题均无条件展示，不便于浏览。同时增强了系统对于助手的依赖程度，能够更有效的利用助手提高效率。

### 用户体验升级

- 全局设置界面重构，清晰的设置分组，快速定位所需配置

![全局设置界面重构](docs/images/readme/settings-ui-refactor.png)

- 模型服务重构与模型管理界面重构

  ![模型服务重构](docs/images/readme/model-service-refactor.png)

  ![模型管理界面](docs/images/readme/model-management-ui.png)

- 一键快速启停 MCP Server

  ![MCP Server 管理](docs/images/readme/mcp-server-management.png)

- 模型选择器 UI 与逻辑重构

  ![模型选择器重构](docs/images/readme/model-selector-refactor.png)

- 助手选择界面重构

  ![助手选择界面重构](docs/images/readme/assistant-selector-refactor.png)

- 内置模型添加上下文窗口，实现 Token 计数器模块

  ![Token 计数器](docs/images/readme/token-calculate.png)

- 新增侧边栏折叠按钮，支持完全隐藏/显示侧边栏
- 可配置的模型能力（视觉、联网、嵌入、工具、思考），通过小图标进行显示，快速浏览模型功能
- 支持具有思考能力的模型调节思考深度
- 自动识别并折叠思考内容，思考中时默认展开，完成后自动折叠
- 支持模型连通性/可用性测试
- 去除所有原版推广内容
- 始终显示 MCP 功能模块
- 将聊天框上的 action 按钮修改为 ToolTip 的形式
- 固定显示当前使用模型，便于快速切换
- 移除搜索按钮，固定显示“搜索聊天记录”按钮
- 重构模型决策器，逻辑更加清晰，创建新对话时，优先使用当前助手配置的默认模型，若未配置，则使用全局默认模型
- 非 OpenAI Provider 的模型也能够使用由 OpenAI 提供的朗读功能
- 重试后保留历史回答，支持通过左右箭头切换不同版本的回答
- 增加获取可用模型的接口，打开管理界面后获取并展示当前 API 下可用模型
- 根据当前模型的上下文Token数自动设置历史消息压缩阈值
- 增加WebDav白名单端点环境变量，以便使用自己的 webdav 服务信息。
### 全新功能模块

- **访问码控制**：支持通过环境变量设置访问码，控制系统访问权限
  - 在 `.env` 文件中设置 `ACCESS_CODE` 环境变量即可启用访问控制
  - 用户需要输入正确的访问码才能使用系统
  - 不设置环境变量则无访问限制

- 模型竞技场，选择多个模型进行对话，对比模型之间的差异
  ![模型竞技场](docs/images/readme/multi-model-arena.png)

- 自定义服务商
  ![自定义服务商](docs/images/readme/custom-provider.png)

- 基于 Google 官方 SDK 重构 Gemini 客户端，支持 Gemini 系列模型内置的 Google 搜索功能

### MCP更新

- 使用当前主流的 streamableHttp 协议对当前 MCP 通信方式重构，同时兼容 sse 协议。便于后续扩展

- 将内置 MCP 列表修改为代码中嵌入，避免对远程服务的依赖。内置 Context7 和 EdgeOne Pages MCP

### 模块移除

- 移除插件模块，该模块功能与 MCP 高度重复，因此仅保留更为活跃的 MCP 服务
- 移除 SD 绘图模块，当前绘图模型较多，等待后续增加新的绘图界面

## 计划功能

- [ ] MCP 服务器添加面板
- [ ] 多文件类型上传支持
- [ ] 对话详细信息，如 qps 等内容显示
- [x] 多模型对话 ✅ **已完成**
- [x] 访问码控制功能 ✅ **已完成**
- [x] 自部署支持、文档完善 ✅ **已完成**
- [x] 环境变量支持 ✅ **已完成**
- [x] 模型/对话上下文统计 ✅ **已完成**
- [ ] OpenAI Response 接口支持

### Support

请通过 [Issue](https://github.com/MoonWeSif/qadchat/issues) 来获取支持

## 致谢

- https://github.com/ChatGPTNextWeb/NextChat —— 项目的地基
- https://github.com/CherryHQ/cherry-studio —— 多处 UI、功能模块重构时参考其设计思路