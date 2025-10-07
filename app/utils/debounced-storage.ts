import { StateStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/app/utils";

const localStorage = safeLocalStorage();

// 防抖存储装饰器
class DebouncedStorage implements StateStorage {
  private storage: StateStorage;
  private debounceMs: number;
  private pendingWrites = new Map<string, NodeJS.Timeout>();
  private pendingData = new Map<string, string>();

  constructor(storage: StateStorage, debounceMs: number = 500) {
    this.storage = storage;
    this.debounceMs = debounceMs;
  }

  async getItem(name: string): Promise<string | null> {
    // 如果有待写入的数据，优先返回
    if (this.pendingData.has(name)) {
      return this.pendingData.get(name) || null;
    }
    return this.storage.getItem(name);
  }

  async setItem(name: string, value: string): Promise<void> {
    // 清除之前的定时器
    const existingTimer = this.pendingWrites.get(name);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // 缓存待写入数据
    this.pendingData.set(name, value);

    // 设置新的防抖定时器
    const timer = setTimeout(async () => {
      try {
        await this.storage.setItem(name, value);
        this.pendingWrites.delete(name);
        this.pendingData.delete(name);
      } catch (error) {
        console.error("[DebouncedStorage] Write error:", error);
        // 失败时回退到 localStorage
        localStorage.setItem(name, value);
      }
    }, this.debounceMs);

    this.pendingWrites.set(name, timer);
  }

  async removeItem(name: string): Promise<void> {
    // 清除相关的防抖操作
    const existingTimer = this.pendingWrites.get(name);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.pendingWrites.delete(name);
    }
    this.pendingData.delete(name);

    await (this.storage.removeItem as any)(name);
  }

  async clear(): Promise<void> {
    // 清除所有防抖操作
    this.pendingWrites.forEach((timer) => clearTimeout(timer));
    this.pendingWrites.clear();
    this.pendingData.clear();

    if ((this.storage as any).clear) {
      await (this.storage as any).clear();
    }
  }

  // 立即刷新所有待写入的数据
  async flush(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [name, timer] of this.pendingWrites.entries()) {
      clearTimeout(timer);
      const value = this.pendingData.get(name);
      if (value !== undefined) {
        const p = (async () => {
          await (this.storage.setItem as any)(name, value);
        })();
        promises.push(p);
      }
    }

    this.pendingWrites.clear();
    this.pendingData.clear();

    await Promise.all(promises);
  }
}

// 智能存储管理器
class SmartStorageManager {
  private configStorage = localStorage; // 配置用快速存储
  private chatStorage: StateStorage; // 聊天数据用防抖存储

  constructor(chatStorage: StateStorage) {
    this.chatStorage = new DebouncedStorage(chatStorage, 800); // 800ms 防抖
  }

  // 根据数据类型选择存储策略
  getStorage(key: string): StateStorage {
    // 配置相关的立即存储，保证设置变更的即时性
    if (
      key.includes("config") ||
      key.includes("access") ||
      key.includes("mask") ||
      key.includes("prompt")
    ) {
      return {
        getItem: (name: string) =>
          Promise.resolve(this.configStorage.getItem(name)),
        setItem: (name: string, value: string) => {
          this.configStorage.setItem(name, value);
          return Promise.resolve();
        },
        removeItem: (name: string) => {
          this.configStorage.removeItem(name);
          return Promise.resolve();
        },
      };
    }

    // 聊天数据使用防抖存储
    return this.chatStorage;
  }

  // 页面卸载时强制刷新
  async onBeforeUnload(): Promise<void> {
    if (this.chatStorage instanceof DebouncedStorage) {
      await this.chatStorage.flush();
    }
  }
}

// 导出全局实例
export let smartStorageManager: SmartStorageManager | null = null;

export function initSmartStorage(chatStorage: StateStorage) {
  smartStorageManager = new SmartStorageManager(chatStorage);

  // 监听页面卸载事件，确保数据不丢失
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", async () => {
      await smartStorageManager?.onBeforeUnload();
    });
  }

  return smartStorageManager;
}

export { DebouncedStorage };
