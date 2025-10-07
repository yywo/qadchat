import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
import { LocaleType } from "./index";
import { SAAS_CHAT_UTM_URL } from "@/app/constant";
// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const isApp = !!getClientConfig()?.isApp;
const en: LocaleType = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized: isApp
      ? `😆 Oops, there's an issue. No worries:
     \\ 1️⃣ Check project documentation, [Click here to visit GitHub 🚀](${SAAS_CHAT_UTM_URL})
     \\ 2️⃣ Want to use your own OpenAI resources? [Click here](/#/settings) to change settings ⚙️`
      : `😆 Oops, there's an issue. Let's fix it:
     \ 1️⃣ Check project documentation, [Click here to visit GitHub 🚀](${SAAS_CHAT_UTM_URL})
     \ 2️⃣ Using a private setup? Go to [Settings](/#/settings) to enter access code 🔑
     \ 3️⃣ Want to use your own OpenAI resources? [Click here](/#/settings) to change settings ⚙️
     `,
  },
  Auth: {
    Return: "Return",
    Title: "Need Access Code",
    Tips: "Please enter access code below",
    SubTips: "Or enter your OpenAI or Google API Key",
    Input: "access code",
    Confirm: "Confirm",
    Later: "Later",
    SaasTips: "",
    TopTips: "",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    MultiModel: {
      Title: "Multi-Model Chat Settings",
      Enabled: "Multi-Model (Enabled)",
      Disabled: "Multi-Model (Disabled)",
      Count: (count: number) => `${count} models`,
      Description:
        "🎯 Multi-model arena mode enabled! Click model selector to select multiple models for conversation.",
      OpenSelector: "Open Model Selector",
      AlreadySelected: (count: number) => `(${count} selected)`,
      Tips: "💡 Tip: In multi-model mode, you can select multiple models simultaneously, and each model will respond independently to your messages, allowing you to compare different models' responses.",
      EnableToast:
        "🎯 Multi-model mode enabled! Click model selector to select multiple models for conversation arena",
      DisableToast: "Multi-model mode disabled",
      MinimumModelsError:
        "Please select at least 2 models to enable multi-model conversation",
      ModelsSelectedToast: (count: number) =>
        `Selected ${count} models for conversation`,
    },
    UI: {
      SidebarToggle: "Toggle Sidebar",
      SearchModels: "Search models...",
      SelectModel: "Select Model",
      ContextTooltip: {
        Current: (current: number, max: number) =>
          `Current context: ${current} / ${max}`,
        CurrentTokens: (current: number, max: number) =>
          `Current tokens: ${current.toLocaleString()} / ${max.toLocaleString()}`,
        CurrentTokensUnknown: (current: number) =>
          `Current tokens: ${current.toLocaleString()} / Unknown`,
        EstimatedTokens: (estimated: number) =>
          `Estimated tokens: ${estimated.toLocaleString()}`,
        ContextTokens: (tokens: string) => `Context: ${tokens} tokens`,
      },
    },
    SubTitle: (count: number) => `${count} messages`,
    EditMessage: {
      Title: "Edit All Messages",
      Topic: {
        Title: "Topic",
        SubTitle: "Change the current topic",
      },
    },
    Actions: {
      ChatList: "Go To Chat List",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Pin: "Pin",
      PinToastContent: "Pinned 1 messages to contextual prompts",
      PinToastAction: "View",
      Delete: "Delete",
      Edit: "Edit",
      FullScreen: "FullScreen",
      RefreshTitle: "Refresh Title",
      RefreshToast: "Title refresh request sent",
      Speech: "Play",
      StopSpeech: "Stop",
      PreviousVersion: "Previous Version",
      NextVersion: "Next Version",
    },
    Commands: {
      new: "Start a new chat",
      newm: "Start a new chat with assistant",
      next: "Next Chat",
      prev: "Previous Chat",
      clear: "Clear Context",
      fork: "Copy Chat",
      del: "Delete Chat",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "To Latest",
      Theme: {
        auto: "Auto",
        light: "Light Theme",
        dark: "Dark Theme",
      },
      Prompt: "Prompts",
      Masks: "Assistants",
      Clear: "Clear Context",
      Settings: "Settings",
      UploadImage: "Upload Images",
      Search: "Search",
      SearchOn: "Search Enabled",
      SearchOff: "Search Disabled",
      SearchEnabledToast:
        "🔍 Search feature enabled! Web search is now available",
      SearchDisabledToast: "❌ Search feature disabled",
    },
    MCP: {
      Title: "MCP Tool Control",
      Enable: "Enable MCP Features",
      EnableDesc:
        "When enabled, MCP tools can be used. When disabled, no MCP-related prompts will be sent",
      NoTools: "No MCP tools available",
      Loading: "Loading...",
      ClientFailed: "MCP client loading failed, handle silently",
      ToolsCount: (count: number) => `${count} tools`,
    },
    Rename: "Rename Chat",
    Typing: "Typing…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts, : to use commands";
    },
    Send: "Send",
    TokenUsage: "Usage",
    TokenTooltip: {
      Context: "Current Context",
      CurrentToken: "Current Token",
      EstimatedToken: "Estimated Token",
      Unknown: "Unknown",
    },
    StartSpeak: "Start Speak",
    StopSpeak: "Stop Speak",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Assistant",
    },
    IsContext: "Contextual Prompt",
    ShortcutKey: {
      Title: "Keyboard Shortcuts",
      newChat: "Open New Chat",
      focusInput: "Focus Input Field",
      copyLastMessage: "Copy Last Reply",
      copyLastCode: "Copy Last Code Block",
      showShortcutKey: "Show Shortcuts",
      clearContext: "Clear Context",
    },
    Thinking: {
      Title: "Thinking Depth",
      Dynamic: "Dynamic Thinking",
      DynamicDesc: "Model decides thinking depth automatically",
      Off: "Thinking Off",
      OffDesc: "No thinking process",
      Light: "Light Thinking",
      LightDesc: "1024 tokens",
      Medium: "Medium Thinking",
      MediumDesc: "4096 tokens",
      Deep: "Deep Thinking",
      DeepDesc: "8192 tokens",
      VeryDeep: "Very Deep Thinking",
      VeryDeepDesc: "16384 tokens",
      Notice: "Only models supporting thinkingBudget can adjust thinking depth",
      ClaudeNotice: "Only Claude series models can adjust thinking depth",
      GeminiNotice: "Only Gemini series models can adjust thinking depth",
      ClaudeLight: "Think",
      ClaudeLightDesc: "5000 tokens",
      ClaudeMedium: "Think hard",
      ClaudeMediumDesc: "10000 tokens",
      ClaudeDeep: "Think Harder",
      ClaudeDeepDesc: "20000 tokens",
      ClaudeVeryDeep: "Ultrathink",
      ClaudeVeryDeepDesc: "32000 tokens",
      ClaudeDynamicDesc:
        "Automatically adjust thinking depth (default 10000 tokens)",
    },
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in assistant or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
    Image: {
      Toast: "Capturing Image...",
      Modal: "Long press or right click to save image",
    },
    Artifacts: {
      Title: "Share Artifacts",
      Error: "Share Error",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    ShowPassword: "ShowPassword",

    Tab: {
      General: "General",
      Sync: "Sync",
      Mask: "Assistant",
      Prompt: "Prompts",
      ModelService: "Model Service",
      ModelConfig: "Model Config",
      Voice: "Voice",
    },

    Danger: {
      Reset: {
        Title: "Reset All Settings",
        SubTitle: "Reset all setting items to default",
        Action: "Reset",
        Confirm: "Confirm to reset all settings to default?",
      },
      Clear: {
        Title: "Clear All Data",
        SubTitle: "Clear all messages and settings",
        Action: "Clear",
        Confirm: "Confirm to clear all messages and settings?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },
    FontFamily: {
      Title: "Chat Font Family",
      SubTitle:
        "Font Family of the chat content, leave empty to apply global default font",
      Placeholder: "Font Family Name",
    },
    InjectSystemPrompts: {
      Title: "Inject System Prompts",
      SubTitle: "Inject a global system prompt for every request",
    },
    InputTemplate: {
      Title: "Input Template",
      SubTitle: "Newest message will be filled to this template",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
      Success: "Update Successful.",
      Failed: "Update Failed.",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    AutoGenerateTitle: {
      Title: "Auto Generate Title",
      SubTitle: "Generate a suitable title based on the conversation content",
    },
    Sync: {
      CloudState: "Last Update",
      NotSyncYet: "Not sync yet",
      Success: "Sync Success",
      Fail: "Sync Fail",

      Config: {
        Modal: {
          Title: "Config Sync",
          Check: "Check Connection",
        },
        SyncType: {
          Title: "Sync Type",
          SubTitle: "Choose your favorite sync service",
        },
        Proxy: {
          Title: "Enable CORS Proxy",
          SubTitle: "Enable a proxy to avoid cross-origin restrictions",
        },
        ProxyUrl: {
          Title: "Proxy Endpoint",
          SubTitle:
            "Only applicable to the built-in CORS proxy for this project",
        },

        WebDav: {
          Endpoint: "WebDAV Endpoint",
          UserName: "User Name",
          Password: "Password",
        },

        UpStash: {
          Endpoint: "UpStash Redis REST Url",
          UserName: "Backup Name",
          Password: "UpStash Redis REST Token",
        },
      },

      LocalState: "Local Data",
      Overview: (overview: any) => {
        return `${overview.chat} chats，${overview.message} messages，${overview.prompt} prompts，${overview.mask} assistants`;
      },
      ImportFailed: "Failed to import from file",
    },
    Mask: {
      ModelIcon: {
        Title: "Use Model Icon as AI Avatar",
        SubTitle:
          "When enabled, AI avatar in conversations will use the current model's icon instead of emoji",
      },
    },
    AccessCode: {
      Title: "Access Code",
      SubTitle: "Access control is enabled, please enter access code",
      Placeholder: "Enter access code",
      Status: {
        Enabled: "Access control enabled",
        Valid: "Access code valid",
        Invalid: "Access code invalid",
      },
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },

    Access: {
      SaasStart: {
        Title: "",
        Label: "",
        SubTitle: "",
        ChatNow: "",
      },
      AccessCode: {
        Title: "Access Code",
        SubTitle:
          "Access control is enabled. ‘SERVER’ badge means the server has provided an API key for that provider via environment variables. After entering a valid access code, you can use those providers directly without filling API keys here.",
        Placeholder: "Enter Code",
      },
      CustomEndpoint: {
        Title: "Custom Endpoint",
        SubTitle: "Use custom Azure or OpenAI service",
      },
      Provider: {
        Title: "Model Provider",
        SubTitle: "Select Azure or OpenAI",
        Name: {
          ByteDance: "ByteDance",
          Alibaba: "Alibaba Cloud",
          Moonshot: "Moonshot",
        },
        Status: {
          Enabled: "Enabled",
        },
        Models: {
          Title: "Enabled Models",
          SubTitle: "List of enabled models in current provider",
          NoModels: "No enabled models",
          Manage: "Manage",
        },
        Description: {
          OpenAI: "OpenAI GPT Series Models",
          Azure: "Microsoft Azure OpenAI Service",
          Google: "Google Gemini Series Models",
          Anthropic: "Anthropic Claude Series Models",
          ByteDance: "ByteDance Doubao Series Models",
          Alibaba: "Alibaba Cloud Qwen Series Models",
          Moonshot: "Moonshot Kimi Series Models",
          DeepSeek: "DeepSeek Series Models",
          XAI: "xAI Grok Series Models",
          SiliconFlow: "SiliconFlow",
          Custom: "Custom",
        },
        Terms: {
          Provider: "Provider",
        },
      },
      OpenAI: {
        ApiKey: {
          Title: "OpenAI API Key",
          SubTitle: "User custom OpenAI Api Key",
          Placeholder: "sk-xxx",
        },

        Endpoint: {
          Title: "OpenAI Endpoint",
          SubTitle: "Must start with http(s):// or use /api/openai as default",
        },
      },
      Azure: {
        ApiKey: {
          Title: "Azure Api Key",
          SubTitle: "Check your api key from Azure console",
          Placeholder: "Azure Api Key",
        },

        Endpoint: {
          Title: "Azure Endpoint",
          SubTitle: "Example: ",
        },

        ApiVerion: {
          Title: "Azure Api Version",
          SubTitle: "Check your api version from azure console",
        },
      },
      Anthropic: {
        ApiKey: {
          Title: "Anthropic API Key",
          SubTitle:
            "Use a custom Anthropic Key to bypass password access restrictions",
          Placeholder: "Anthropic API Key",
        },

        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },

        ApiVerion: {
          Title: "API Version (claude api version)",
          SubTitle: "Select and input a specific API version",
        },
      },

      ByteDance: {
        ApiKey: {
          Title: "ByteDance API Key",
          SubTitle: "Use a custom ByteDance API Key",
          Placeholder: "ByteDance API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      Alibaba: {
        ApiKey: {
          Title: "Alibaba API Key",
          SubTitle: "Use a custom Alibaba Cloud API Key",
          Placeholder: "Alibaba Cloud API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      Moonshot: {
        ApiKey: {
          Title: "Moonshot API Key",
          SubTitle: "Use a custom Moonshot API Key",
          Placeholder: "Moonshot API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      DeepSeek: {
        ApiKey: {
          Title: "DeepSeek API Key",
          SubTitle: "Use a custom DeepSeek API Key",
          Placeholder: "DeepSeek API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      XAI: {
        ApiKey: {
          Title: "XAI API Key",
          SubTitle: "Use a custom XAI API Key",
          Placeholder: "XAI API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      SiliconFlow: {
        ApiKey: {
          Title: "SiliconFlow API Key",
          SubTitle: "Use a custom SiliconFlow API Key",
          Placeholder: "SiliconFlow API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      CustomModel: {
        Title: "Custom Models",
        SubTitle: "Custom model options, seperated by comma",
      },
      Google: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Obtain your API Key from Google AI",
          Placeholder: "Google AI API Key",
        },

        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },

        ApiVersion: {
          Title: "API Version (specific to gemini-pro)",
          SubTitle: "Select a specific API version",
        },
        GoogleSafetySettings: {
          Title: "Google Safety Settings",
          SubTitle: "Select a safety filtering level",
        },
      },
      Baidu: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Use custom Baidu API Key",
          Placeholder: "Baidu API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Use custom Baidu Secret Key",
          Placeholder: "Baidu Secret Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Not supported for custom configuration, go to .env",
        },
      },
      Tencent: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Use custom Tencent API Key",
          Placeholder: "Tencent API Key",
        },
        SecretKey: {
          Title: "Secret Key",
          SubTitle: "Use custom Tencent Secret Key",
          Placeholder: "Tencent Secret Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Not supported for custom configuration, go to .env",
        },
      },
      ChatGLM: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Use custom ChatGLM API Key",
          Placeholder: "ChatGLM API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      Iflytek: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Get APIKey from iFlytek Spark console",
          Placeholder: "API Key",
        },
        ApiSecret: {
          Title: "API Secret",
          SubTitle: "Get APISecret from iFlytek Spark console",
          Placeholder: "API Secret",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      AI302: {
        ApiKey: {
          Title: "API Key",
          SubTitle: "Use custom 302.AI API Key",
          Placeholder: "302.AI API Key",
        },
        Endpoint: {
          Title: "Endpoint Address",
          SubTitle: "Example: ",
        },
      },
      CustomProvider: {
        Add: {
          Title: "Add Custom Provider",
          Button: "Add Custom Provider",
          Description: "Add custom channel based on existing provider types",
        },
        Modal: {
          Title: "Add Custom Provider",
          Name: {
            Title: "Provider Name",
            Placeholder: "Enter custom provider name",
            Required: "Please enter provider name",
            Unique: "Provider name already exists, please use another name",
          },
          Type: {
            Title: "Provider Type",
            OpenAI: "OpenAI - Compatible with OpenAI API services",
            Google: "Google - Google Gemini API",
            Anthropic: "Anthropic - Anthropic Claude API",
          },
          ApiKey: {
            Title: "API Key",
            Placeholder: "Enter API Key",
            Required: "Please enter API Key",
          },
          Endpoint: {
            Title: "Custom Endpoint",
            Placeholder: "Leave empty to use default endpoint",
            Optional: "(Optional)",
          },
          Cancel: "Cancel",
          Confirm: "Add",
        },
        Config: {
          Type: "Provider Type",
          BasedOn: "Based on",
          ApiKeyDescription: "Custom provider's API key",
          EndpointDescription: "Custom API endpoint address",
          EndpointPlaceholder: "API endpoint address",
          Delete: {
            Title: "Delete Provider",
            SubTitle: "Delete this custom provider and all its configurations",
            Button: "Delete",
            Confirm: "Are you sure you want to delete the custom provider",
            ConfirmSuffix: "?",
          },
        },
      },
    },

    Model: "Model",
    CompressModel: {
      Title: "Summary Model",
      SubTitle: "Model used to compress history and generate title",
    },
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    TopP: {
      Title: "Top P",
      SubTitle: "Do not alter this value together with temperature",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
    FrequencyPenalty: {
      Title: "Frequency Penalty",
      SubTitle:
        "A larger value decreasing the likelihood to repeat the same line",
    },
    TTS: {
      Enable: {
        Title: "Enable TTS",
        SubTitle: "Enable text-to-speech service",
      },
      Autoplay: {
        Title: "Enable Autoplay",
        SubTitle:
          "Automatically generate speech and play, you need to enable the text-to-speech switch first",
      },
      Model: "Model",
      Engine: "TTS Engine",
      EngineConfig: {
        Title: "Configuration Note",
        SubTitle:
          "OpenAI-TTS will use the configuration from OpenAI provider in Model Services. Please add the corresponding API Key in OpenAI provider before use",
      },
      Voice: {
        Title: "Voice",
        SubTitle: "The voice to use when generating the audio",
      },
      Speed: {
        Title: "Speed",
        SubTitle: "The speed of the generated audio",
      },
    },
    Realtime: {
      Enable: {
        Title: "Realtime Chat",
        SubTitle: "Enable realtime chat feature",
      },
      Provider: {
        Title: "Model Provider",
        SubTitle: "Switch between different providers",
      },
      Model: {
        Title: "Model",
        SubTitle: "Select a model",
      },
      ApiKey: {
        Title: "API Key",
        SubTitle: "API Key",
        Placeholder: "API Key",
      },
      Azure: {
        Endpoint: {
          Title: "Endpoint",
          SubTitle: "Endpoint",
        },
        Deployment: {
          Title: "Deployment Name",
          SubTitle: "Deployment Name",
        },
      },
      Temperature: {
        Title: "Randomness (temperature)",
        SubTitle: "Higher values result in more random responses",
      },
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, bold text, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Download: {
    Success: "Content downloaded to your directory.",
    Failed: "Download failed.",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Current Chat Settings",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },

  ChatSettings: {
    Name: "Chat Settings",
  },
  Mcp: {
    Name: "MCP",
  },
  FineTuned: {
    Sysmessage: "You are an assistant that",
  },
  SearchChat: {
    Name: "Search",
    Page: {
      Title: "Search Chat History",
      Search: "Enter search query to search chat history",
      NoResult: "No results found",
      NoData: "No data",
      Loading: "Loading...",

      SubTitle: (count: number) => `Found ${count} results`,
    },
    Item: {
      View: "View",
    },
  },

  Mask: {
    Name: "Assistant",
    DefaultName: "Default Assistant",
    Management: "Assistant Management",
    NewMask: "New Assistant",
    DefaultModel: "Default Model",
    DefaultModelDesc: "Default model for new conversations",
    UseGlobalModel: "Use Global Default Model",
    ConversationCount: (count: number) =>
      `${count} conversation${count > 1 ? "s" : ""}`,
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: "Edit Assistant",
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
      Artifacts: {
        Title: "Enable Artifacts",
        SubTitle: "Can render HTML page when enable artifacts.",
      },
      CodeFold: {
        Title: "Enable CodeFold",
        SubTitle:
          "Automatically collapse/expand overly long code blocks when CodeFold is enabled",
      },
      Share: {
        Title: "Share This Assistant",
        SubTitle: "Generate a link to this assistant",
        Action: "Copy Link",
      },
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Just Start",
    Title: "Pick an Assistant",
    SubTitle: "Chat with the Soul behind the Assistant",
    More: "Find More",
    Less: "Fold Code",
    ShowCode: "Show Code",
    Preview: "Preview",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
    Searching: "Searching...",
    Search: "Search Results",
    NoSearch: "No Search Results",
    SearchFormat: (SearchTime?: number) =>
      SearchTime !== undefined
        ? `(Search for ${Math.round(SearchTime / 1000)} s)`
        : "",
    Thinking: "Thinking...",
    Think: "Content of Thought",
    NoThink: "No Thought",
    ThinkFormat: (thinkingTime?: number) =>
      thinkingTime !== undefined
        ? `(Thinking for ${Math.round(thinkingTime / 1000)} s)`
        : "",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
    Export: "Export",
    Import: "Import",
    Sync: "Sync",
    Config: "Config",
    Success: "Success",
  },
  Exporter: {
    Description: {
      Title: "Only messages after clearing the context will be displayed",
    },
    Model: "Model",
    Messages: "Messages",
    Topic: "Topic",
    Time: "Time",
  },
  URLCommand: {
    Code: "Detected access code from url, confirm to apply? ",
    Settings: "Detected settings from url, confirm to apply?",
  },
};

export default en;
