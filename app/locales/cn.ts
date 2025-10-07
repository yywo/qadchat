import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";

const isApp = !!getClientConfig()?.isApp;

const cn = {
  WIP: "该功能仍在开发中……",
  Error: {
    Unauthorized: isApp
      ? `😆 对话遇到了一些问题，不用慌:
       \\ 1️⃣ 查看项目文档，[点击这里访问 GitHub 🚀](${SAAS_CHAT_UTM_URL})
       \\ 2️⃣ 如果你想消耗自己的 OpenAI 资源，点击[这里](/#/settings)修改设置 ⚙️`
      : `😆 对话遇到了一些问题，不用慌:
       \ 1️⃣ 查看项目文档，[点击这里访问 GitHub 🚀](${SAAS_CHAT_UTM_URL})
       \ 2️⃣ 如果你正在使用私有部署版本，请前往[设置页](/#/settings)输入访问码 🔑
       \ 3️⃣ 如果你想消耗自己的 OpenAI 资源，点击[这里](/#/settings)修改设置 ⚙️
       `,
  },
  Auth: {
    Return: "返回",
    Title: "需要密码",
    Tips: "管理员开启了密码验证，请在下方填入访问码",
    SubTips: "或者输入你的 OpenAI 或 Google AI 密钥",
    Input: "在此处填写访问码",
    Confirm: "确认",
    Later: "稍后再说",
    SaasTips: "",
    TopTips: "",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} 条对话`,
  },
  Chat: {
    MultiModel: {
      Title: "多模型对话设置",
      Enabled: "多模型 (开启)",
      Disabled: "多模型 (关闭)",
      Count: (count: number) => `${count}个`,
      Description:
        "🎯 多模型对话竞技场模式已启用！点击模型选择器可选择多个模型进行对话。",
      OpenSelector: "打开模型选择器",
      AlreadySelected: (count: number) => `(${count} 个已选择)`,
      Tips: "💡 提示：在多模型模式下，您可以同时选择多个模型，每个模型都会独立回复您的消息，方便对比不同模型的回答效果。",
      EnableToast:
        "🎯 多模型模式已开启！点击模型选择器可选择多个模型进行对话竞技场",
      DisableToast: "多模型模式已关闭",
      MinimumModelsError: "请至少选择2个模型才能启用多模型对话",
      ModelsSelectedToast: (count: number) => `已选择 ${count} 个模型进行对话`,
    },
    UI: {
      SidebarToggle: "折叠/展开侧边栏",
      SearchModels: "搜索模型...",
      SelectModel: "选择模型",
      ContextTooltip: {
        Current: (current: number, max: number) =>
          `当前上下文: ${current} / ${max}`,
        CurrentTokens: (current: number, max: number) =>
          `当前Token: ${current.toLocaleString()} / ${max.toLocaleString()}`,
        CurrentTokensUnknown: (current: number) =>
          `当前Token: ${current.toLocaleString()} / 未知`,
        EstimatedTokens: (estimated: number) =>
          `预估Token: ${estimated.toLocaleString()}`,
        ContextTokens: (tokens: string) => `上下文: ${tokens} tokens`,
      },
    },
    SubTitle: (count: number) => `共 ${count} 条对话`,
    EditMessage: {
      Title: "编辑消息记录",
      Topic: {
        Title: "聊天主题",
        SubTitle: "更改当前聊天主题",
      },
    },
    Actions: {
      ChatList: "查看消息列表",
      CompressedHistory: "查看压缩后的历史 Prompt",
      Export: "导出聊天记录",
      Copy: "复制",
      Stop: "停止",
      Retry: "重试",
      Pin: "固定",
      PinToastContent: "已将 1 条对话固定至预设提示词",
      PinToastAction: "查看",
      Delete: "删除",
      Edit: "编辑",
      FullScreen: "全屏",
      RefreshTitle: "刷新标题",
      RefreshToast: "已发送刷新标题请求",
      Speech: "朗读",
      StopSpeech: "停止",
      PreviousVersion: "上一版本",
      NextVersion: "下一版本",
    },
    Commands: {
      new: "新建聊天",
      newm: "从助手新建聊天",
      next: "下一个聊天",
      prev: "上一个聊天",
      clear: "清除上下文",
      fork: "复制聊天",
      del: "删除聊天",
    },
    InputActions: {
      Stop: "停止响应",
      ToBottom: "滚到最新",
      Theme: {
        auto: "自动主题",
        light: "亮色模式",
        dark: "深色模式",
      },
      Prompt: "快捷指令",
      Masks: "所有助手",
      Clear: "清除聊天",
      Settings: "对话设置",
      UploadImage: "上传图片",
      Search: "搜索功能",
      SearchOn: "搜索已启用",
      SearchOff: "搜索已禁用",
      SearchEnabledToast: "🔍 搜索功能已启用！现在可以进行网络搜索了",
      SearchDisabledToast: "❌ 搜索功能已禁用",
    },
    MCP: {
      Title: "MCP 工具控制",
      Enable: "启用 MCP 功能",
      EnableDesc: "开启后可使用 MCP 工具，关闭后不会发送任何 MCP 相关提示词",
      NoTools: "暂无可用的 MCP 工具",
      Loading: "加载中...",
      ClientFailed: "MCP 客户端加载失败，静默处理",
      ToolsCount: (count: number) => `${count} 个工具`,
    },
    Rename: "重命名对话",
    Typing: "正在输入…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} 发送`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += "，Shift + Enter 换行";
      }
      return inputHints + "，/ 触发补全，: 触发命令";
    },
    Send: "发送",
    TokenUsage: "使用率",
    TokenTooltip: {
      Context: "当前上下文",
      CurrentToken: "当前Token",
      EstimatedToken: "预估Token",
      Unknown: "未知",
    },
    StartSpeak: "说话",
    StopSpeak: "停止",
    Config: {
      Reset: "清除记忆",
      SaveAs: "存为助手",
    },
    IsContext: "预设提示词",
    ShortcutKey: {
      Title: "键盘快捷方式",
      newChat: "打开新聊天",
      focusInput: "聚焦输入框",
      copyLastMessage: "复制最后一个回复",
      copyLastCode: "复制最后一个代码块",
      showShortcutKey: "显示快捷方式",
      clearContext: "清除上下文",
    },
    Thinking: {
      Title: "思考深度",
      Dynamic: "动态思考",
      DynamicDesc: "模型自动决定思考深度",
      Off: "关闭思考",
      OffDesc: "不进行思考过程",
      Light: "轻度思考",
      LightDesc: "1024 tokens",
      Medium: "中度思考",
      MediumDesc: "4096 tokens",
      Deep: "深度思考",
      DeepDesc: "8192 tokens",
      VeryDeep: "极深思考",
      VeryDeepDesc: "16384 tokens",
      Notice: "仅支持 thinkingBudget 的模型可调节思维深度",
      ClaudeNotice: "仅支持 Claude 系列模型可调节思维深度",
      GeminiNotice: "仅支持 Gemini 系列模型可调节思维深度",
      ClaudeLight: "轻度思考",
      ClaudeLightDesc: "5000 tokens",
      ClaudeMedium: "中度思考",
      ClaudeMediumDesc: "10000 tokens",
      ClaudeDeep: "深度思考",
      ClaudeDeepDesc: "20000 tokens",
      ClaudeVeryDeep: "极深思考",
      ClaudeVeryDeepDesc: "32000 tokens",
      ClaudeDynamicDesc: "自动调节思考深度（默认10000 tokens）",
    },
  },
  Export: {
    Title: "分享聊天记录",
    Copy: "全部复制",
    Download: "下载文件",
    Share: "分享到 ShareGPT",
    MessageFromYou: "用户",
    MessageFromChatGPT: "ChatGPT",
    Format: {
      Title: "导出格式",
      SubTitle: "可以导出 Markdown 文本或者 PNG 图片",
    },
    IncludeContext: {
      Title: "包含助手上下文",
      SubTitle: "是否在消息中展示助手上下文",
    },
    Steps: {
      Select: "选取",
      Preview: "预览",
    },
    Image: {
      Toast: "正在生成截图",
      Modal: "长按或右键保存图片",
    },
    Artifacts: {
      Title: "分享页面",
      Error: "分享失败",
    },
  },
  Select: {
    Search: "搜索消息",
    All: "选取全部",
    Latest: "最近几条",
    Clear: "清除选中",
  },
  Memory: {
    Title: "历史摘要",
    EmptyContent: "对话内容过短，无需总结",
    Send: "自动压缩聊天记录并作为上下文发送",
    Copy: "复制摘要",
    Reset: "[unused]",
    ResetConfirm: "确认清空历史摘要？",
  },
  Home: {
    NewChat: "新的聊天",
    DeleteChat: "确认删除选中的对话？",
    DeleteToast: "已删除会话",
    Revert: "撤销",
  },
  Settings: {
    Title: "设置",
    SubTitle: "所有设置选项",
    ShowPassword: "显示密码",

    Tab: {
      General: "通用配置",
      Sync: "云同步",
      Mask: "助手",
      Prompt: "提示词",
      ModelService: "模型服务",
      ModelConfig: "模型配置",
      Voice: "语音",
    },

    Danger: {
      Reset: {
        Title: "重置所有设置",
        SubTitle: "重置所有设置项回默认值",
        Action: "立即重置",
        Confirm: "确认重置所有设置？",
      },
      Clear: {
        Title: "清除所有数据",
        SubTitle: "清除所有聊天、设置数据",
        Action: "立即清除",
        Confirm: "确认清除所有聊天、设置数据？",
      },
    },
    Lang: {
      Name: "Language", // 注意：如果要添加新的翻译，请不要翻译此值，将它保留为 `Language`
      All: "所有语言",
    },
    Avatar: "头像",
    FontSize: {
      Title: "字体大小",
      SubTitle: "聊天内容的字体大小",
    },
    FontFamily: {
      Title: "聊天字体",
      SubTitle: "聊天内容的字体，若置空则应用全局默认字体",
      Placeholder: "字体名称",
    },
    InjectSystemPrompts: {
      Title: "注入系统级提示信息",
      SubTitle: "强制给每次请求的消息列表开头添加一个模拟 ChatGPT 的系统提示",
    },
    InputTemplate: {
      Title: "用户输入预处理",
      SubTitle: "用户最新的一条消息会填充到此模板",
    },

    Update: {
      Version: (x: string) => `当前版本：${x}`,
      IsLatest: "已是最新版本",
      CheckUpdate: "检查更新",
      IsChecking: "正在检查更新...",
      FoundUpdate: (x: string) => `发现新版本：${x}`,
      GoToUpdate: "前往更新",
      Success: "更新成功！",
      Failed: "更新失败",
    },
    SendKey: "发送键",
    Theme: "主题",
    TightBorder: "无边框模式",
    SendPreviewBubble: {
      Title: "预览气泡",
      SubTitle: "在预览气泡中预览 Markdown 内容",
    },
    AutoGenerateTitle: {
      Title: "自动生成标题",
      SubTitle: "根据对话内容生成合适的标题",
    },
    Sync: {
      CloudState: "云端数据",
      NotSyncYet: "还没有进行过同步",
      Success: "同步成功",
      Fail: "同步失败",

      Config: {
        Modal: {
          Title: "配置云同步",
          Check: "检查可用性",
        },
        SyncType: {
          Title: "同步类型",
          SubTitle: "选择喜爱的同步服务器",
        },
        Proxy: {
          Title: "启用代理",
          SubTitle: "在浏览器中同步时，必须启用代理以避免跨域限制",
        },
        ProxyUrl: {
          Title: "代理地址",
          SubTitle: "仅适用于本项目自带的跨域代理",
        },

        WebDav: {
          Endpoint: "WebDAV 地址",
          UserName: "用户名",
          Password: "密码",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "备份名称",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "本地数据",
      Overview: (overview: any) => {
        return `${overview.chat} 次对话，${overview.message} 条消息，${overview.prompt} 条提示词，${overview.mask} 个助手`;
      },
      ImportFailed: "导入失败",
    },
    Mask: {
      ModelIcon: {
        Title: "使用模型图标作为AI头像",
        SubTitle: "启用后，对话中的AI头像将使用当前模型的图标，而不是表情符号",
      },
    },
    AccessCode: {
      Title: "访问码",
      SubTitle: "当前系统启用了访问控制，请输入访问码",
      Placeholder: "请输入访问码",
      Status: {
        Enabled: "访问控制已启用",
        Valid: "访问码有效",
        Invalid: "访问码无效",
      },
    },
    Prompt: {
      Disable: {
        Title: "禁用提示词自动补全",
        SubTitle: "在输入框开头输入 / 即可触发自动补全",
      },
      List: "自定义提示词列表",
      ListCount: (builtin: number, custom: number) =>
        `内置 ${builtin} 条，用户定义 ${custom} 条`,
      Edit: "编辑",
      Modal: {
        Title: "提示词列表",
        Add: "新建",
        Search: "搜索提示词",
      },
      EditModal: {
        Title: "编辑提示词",
      },
    },
    HistoryCount: {
      Title: "附带历史消息数",
      SubTitle: "每次请求携带的历史消息数",
    },
    CompressThreshold: {
      Title: "历史消息长度压缩阈值",
      SubTitle: "当未压缩的历史消息超过该值时，将进行压缩",
    },

    Access: {
      SaasStart: {
        Title: "",
        Label: "",
        SubTitle: "",
        ChatNow: "",
      },
      AccessCode: {
        Title: "访问密码",
        SubTitle:
          "已启用访问控制。带有 “SERVER” 标识表示后端已为该服务商配置了 API Key（通过环境变量）。输入正确访问码后，可直接使用这些服务商，无需在此填写 API Key。",
        Placeholder: "请输入访问密码",
      },
      CustomEndpoint: {
        Title: "自定义接口",
        SubTitle: "是否使用自定义接口",
      },
      Provider: {
        Title: "模型服务商",
        SubTitle: "切换不同的服务商",
        Name: {
          ByteDance: "字节跳动",
          Alibaba: "阿里云",
          Moonshot: "月之暗面",
        },
        Status: {
          Enabled: "已启用",
        },
        Models: {
          Title: "启用的模型",
          SubTitle: "当前服务商中已启用的模型列表",
          NoModels: "暂无启用的模型",
          Manage: "管理",
        },
        Description: {
          OpenAI: "OpenAI GPT 系列模型",
          Google: "Google Gemini 系列模型",
          Anthropic: "Anthropic Claude 系列模型",
          ByteDance: "字节跳动豆包系列模型",
          Alibaba: "阿里云通义千问系列模型",
          Moonshot: "Moonshot Kimi 系列模型",
          DeepSeek: "DeepSeek 系列模型",
          XAI: "xAI Grok 系列模型",
          SiliconFlow: "SiliconFlow 硅基流动",
          Custom: "自定义",
        },
        Terms: {
          Provider: "服务商",
        },
      },
      OpenAI: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "使用自定义 OpenAI Key 绕过密码访问限制",
          Placeholder: "OpenAI API Key",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "除默认地址外，必须包含 http(s)://",
        },
      },

      Anthropic: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义 Anthropic Key 绕过密码访问限制",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },

        ApiVerion: {
          Title: "接口版本 (claude api version)",
          SubTitle: "选择一个特定的 API 版本输入",
        },
      },
      Google: {
        ApiKey: {
          Title: "API 密钥",
          SubTitle: "从 Google AI 获取您的 API 密钥",
          Placeholder: "Google AI API KEY",
        },

        Endpoint: {
          Title: "接口地址",
          SubTitle: "示例：",
        },

        ApiVersion: {
          Title: "API 版本（仅适用于 gemini-pro）",
          SubTitle: "选择一个特定的 API 版本",
        },
        GoogleSafetySettings: {
          Title: "Google 安全过滤级别",
          SubTitle: "设置内容过滤级别",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "使用自定义 Baidu API Key",
          Placeholder: "Baidu API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "使用自定义 Baidu Secret Key",
          Placeholder: "Baidu Secret Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "不支持自定义前往.env配置",
        },
      },
      Tencent: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "使用自定义腾讯云API Key",
          Placeholder: "Tencent API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "使用自定义腾讯云Secret Key",
          Placeholder: "Tencent Secret Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "不支持自定义前往.env配置",
        },
      },
      ByteDance: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义 ByteDance API Key",
          Placeholder: "ByteDance API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义阿里云API Key",
          Placeholder: "Alibaba Cloud API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      Moonshot: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义月之暗面API Key",
          Placeholder: "Moonshot API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      DeepSeek: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义DeepSeek API Key",
          Placeholder: "DeepSeek API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      XAI: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义XAI API Key",
          Placeholder: "XAI API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      ChatGLM: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义 ChatGLM API Key",
          Placeholder: "ChatGLM API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      SiliconFlow: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义硅基流动 API Key",
          Placeholder: "硅基流动 API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },

      Iflytek: {
        ApiKey: {
          Title: "ApiKey",
          SubTitle: "从讯飞星火控制台获取的 APIKey",
          Placeholder: "APIKey",
        },
        ApiSecret: {
          Title: "ApiSecret",
          SubTitle: "从讯飞星火控制台获取的 APISecret",
          Placeholder: "APISecret",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      CustomModel: {
        Title: "自定义模型名",
        SubTitle: "增加自定义模型可选项，使用英文逗号隔开",
      },
      AI302: {
        ApiKey: {
          Title: "接口密钥",
          SubTitle: "使用自定义302.AI API Key",
          Placeholder: "302.AI API Key",
        },
        Endpoint: {
          Title: "接口地址",
          SubTitle: "样例：",
        },
      },
      CustomProvider: {
        Add: {
          Title: "添加自定义服务商",
          Button: "添加自定义服务商",
          Description: "基于现有服务商类型添加自定义渠道",
        },
        Modal: {
          Title: "添加自定义服务商",
          Name: {
            Title: "服务商名称",
            Placeholder: "请输入自定义服务商名称",
            Required: "请输入服务商名称",
            Unique: "服务商名称已存在，请使用其他名称",
          },
          Type: {
            Title: "服务商类型",
            OpenAI: "OpenAI - 兼容 OpenAI API 的服务",
            Google: "Google - Google Gemini API",
            Anthropic: "Anthropic - Anthropic Claude API",
          },
          ApiKey: {
            Title: "API Key",
            Placeholder: "请输入 API Key",
            Required: "请输入 API Key",
          },
          Endpoint: {
            Title: "自定义端点",
            Placeholder: "留空使用默认端点",
            Optional: "(可选)",
          },
          Cancel: "取消",
          Confirm: "添加",
        },
        Config: {
          Type: "服务商类型",
          BasedOn: "基于",
          ApiKeyDescription: "自定义服务商的 API 密钥",
          EndpointDescription: "自定义的 API 端点地址",
          EndpointPlaceholder: "API 端点地址",
          Delete: {
            Title: "删除服务商",
            SubTitle: "删除此自定义服务商及其所有配置",
            Button: "删除",
            Confirm: "确定要删除自定义服务商",
            ConfirmSuffix: "吗？",
          },
        },
      },
    },

    Model: "模型 (model)",
    CompressModel: {
      Title: "对话摘要模型",
      SubTitle: "用于压缩历史记录、生成对话标题的模型",
    },
    Temperature: {
      Title: "随机性 (temperature)",
      SubTitle: "值越大，回复越随机",
    },
    TopP: {
      Title: "核采样 (top_p)",
      SubTitle: "与随机性类似，但不要和随机性一起更改",
    },
    MaxTokens: {
      Title: "单次回复限制 (max_tokens)",
      SubTitle:
        "单次交互所用的最大 Token 数。设置为 -1 表示不限制，并且不会在请求中传输该字段。",
    },
    PresencePenalty: {
      Title: "话题新鲜度 (presence_penalty)",
      SubTitle: "值越大，越有可能扩展到新话题",
    },
    FrequencyPenalty: {
      Title: "频率惩罚度 (frequency_penalty)",
      SubTitle: "值越大，越有可能降低重复字词",
    },
    TTS: {
      Enable: {
        Title: "启用文本转语音",
        SubTitle: "启用文本生成语音服务",
      },
      Autoplay: {
        Title: "启用自动朗读",
        SubTitle: "自动生成语音并播放，需先开启文本转语音开关",
      },
      Model: "模型",
      Engine: "转换引擎",
      EngineConfig: {
        Title: "配置说明",
        SubTitle:
          "OpenAI-TTS 将使用模型服务中 OpenAI 提供商的配置，使用前需要在 OpenAI 提供商中添加对应的 API Key",
      },
      Voice: {
        Title: "声音",
        SubTitle: "生成语音时使用的声音",
      },
      Speed: {
        Title: "速度",
        SubTitle: "生成语音的速度",
      },
    },
    Realtime: {
      Enable: {
        Title: "实时聊天",
        SubTitle: "开启实时聊天功能",
      },
      Provider: {
        Title: "模型服务商",
        SubTitle: "切换不同的服务商",
      },
      Model: {
        Title: "模型",
        SubTitle: "选择一个模型",
      },
      ApiKey: {
        Title: "API Key",
        SubTitle: "API Key",
        Placeholder: "API Key",
      },

      Temperature: {
        Title: "随机性 (temperature)",
        SubTitle: "值越大，回复越随机",
      },
    },
  },
  Store: {
    DefaultTopic: "新的聊天",
    BotHello: "有什么可以帮你的吗",
    Error: "出错了，稍后重试吧",
    Prompt: {
      History: (content: string) => "这是历史聊天总结作为前情提要：" + content,
      Topic:
        "使用四到五个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，不要加粗，如果没有主题，请直接返回“闲聊”",
      Summarize:
        "简要总结一下对话内容，用作后续的上下文提示 prompt，控制在 200 字以内",
    },
  },
  Copy: {
    Success: "已写入剪贴板",
    Failed: "复制失败，请赋予剪贴板权限",
  },
  Download: {
    Success: "内容已下载到您的目录。",
    Failed: "下载失败。",
  },
  Context: {
    Toast: (x: any) => `包含 ${x} 条预设提示词`,
    Edit: "当前对话设置",
    Add: "新增一条对话",
    Clear: "上下文已清除",
    Revert: "恢复上下文",
  },

  ChatSettings: {
    Name: "对话设置",
  },
  Mcp: {
    Name: "MCP",
  },
  FineTuned: {
    Sysmessage: "你是一个助手",
  },
  SearchChat: {
    Name: "搜索聊天记录",
    Page: {
      Title: "搜索聊天记录",
      Search: "输入搜索关键词",
      NoResult: "没有找到结果",
      NoData: "没有数据",
      Loading: "加载中",

      SubTitle: (count: number) => `搜索到 ${count} 条结果`,
    },
    Item: {
      View: "查看",
    },
  },

  Mask: {
    Name: "助手",
    DefaultName: "默认助手",
    Management: "助手管理",
    NewMask: "新建助手",
    DefaultModel: "默认模型",
    DefaultModelDesc: "新建对话时使用的默认模型",
    UseGlobalModel: "使用全局默认模型",
    ConversationCount: (count: number) => `${count} 个对话`,
    Page: {
      Title: "预设角色助手",
      SubTitle: (count: number) => `${count} 个预设角色定义`,
      Search: "搜索角色助手",
      Create: "新建",
    },
    Item: {
      Info: (count: number) => `包含 ${count} 条预设对话`,
      Chat: "对话",
      View: "查看",
      Edit: "编辑",
      Delete: "删除",
      DeleteConfirm: "确认删除？",
    },
    EditModal: {
      Title: "编辑助手",
      Download: "下载预设",
      Clone: "克隆预设",
    },
    Config: {
      Avatar: "角色头像",
      Name: "角色名称",
      Sync: {
        Title: "使用全局设置",
        SubTitle: "当前对话是否使用全局模型设置",
        Confirm: "当前对话的自定义设置将会被自动覆盖，确认启用全局设置？",
      },
      HideContext: {
        Title: "隐藏预设对话",
        SubTitle: "隐藏后预设对话不会出现在聊天界面",
      },
      Artifacts: {
        Title: "启用Artifacts",
        SubTitle: "启用之后可以直接渲染HTML页面",
      },
      CodeFold: {
        Title: "启用代码折叠",
        SubTitle: "启用之后可以自动折叠/展开过长的代码块",
      },
      Share: {
        Title: "分享此助手",
        SubTitle: "生成此助手的直达链接",
        Action: "复制链接",
      },
    },
  },
  NewChat: {
    Return: "返回",
    Skip: "直接开始",
    Title: "挑选一个助手",
    SubTitle: "现在开始，与助手背后的灵魂思维碰撞",
    More: "查看全部",
    Less: "折叠代码",
    ShowCode: "显示代码",
    Preview: "预览",
    NotShow: "不再展示",
    ConfirmNoShow: "确认禁用？禁用后可以随时在设置中重新启用。",
    Searching: "搜索中...",
    Search: "搜索内容",
    NoSearch: "没有搜索内容",
    SearchFormat: (SearchTime?: number) =>
      SearchTime !== undefined
        ? `（用时 ${Math.round(SearchTime / 1000)} 秒）`
        : "",
    Thinking: "正在思考中...",
    Think: "思考过程",
    NoThink: "没有思考过程",
    ThinkFormat: (thinkingTime?: number) =>
      thinkingTime !== undefined
        ? `（用时 ${Math.round(thinkingTime / 1000)} 秒）`
        : "",
  },

  URLCommand: {
    Code: "检测到链接中已经包含访问码，是否自动填入？",
    Settings: "检测到链接中包含了预制设置，是否自动填入？",
  },

  UI: {
    Confirm: "确认",
    Cancel: "取消",
    Close: "关闭",
    Create: "新建",
    Edit: "编辑",
    Export: "导出",
    Import: "导入",
    Sync: "同步",
    Config: "配置",
    Success: "操作成功",
  },
  Exporter: {
    Description: {
      Title: "只有清除上下文之后的消息会被展示",
    },
    Model: "模型",
    Messages: "消息",
    Topic: "主题",
    Time: "时间",
  },
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type LocaleType = typeof cn;
export type PartialLocaleType = DeepPartial<typeof cn>;

export default cn;
