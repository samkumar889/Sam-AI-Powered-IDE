const DB_NAME = "SAMAIWorkspaceMemory";
const DB_VERSION = 1;
const STORE_NAME = "memory";

interface WorkspaceMemory {
  id: string;
  createdAt: number;
  updatedAt: number;
  architecture?: any[];
  previousChats?: any[];
  generatedFiles?: any[];
  userDecisions?: any[];
  techStack?: any;
  projectMemory?: any;
}

class WorkspaceMemoryDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });
  }

  async getMemory(): Promise<WorkspaceMemory | null> {
    if (!this.db) throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("current");

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMemory(updates: Partial<Omit<WorkspaceMemory, "id" | "createdAt" | "updatedAt">>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const existing = await this.getMemory();
    const memory: WorkspaceMemory = {
      id: "current",
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
      architecture: updates.architecture ?? existing?.architecture,
      previousChats: updates.previousChats ?? existing?.previousChats,
      generatedFiles: updates.generatedFiles ?? existing?.generatedFiles,
      userDecisions: updates.userDecisions ?? existing?.userDecisions,
      techStack: updates.techStack ?? existing?.techStack,
      projectMemory: updates.projectMemory ?? existing?.projectMemory,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(memory);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearMemory(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const workspaceMemoryDB = new WorkspaceMemoryDB();
