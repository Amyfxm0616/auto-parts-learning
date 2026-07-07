const { ipcRenderer } = require('electron');

const electronAPI = {
  isElectron: true,
  syncPublishedQuestions: (questionsJSON: string): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('sync-published-questions', questionsJSON),
};

(globalThis as typeof globalThis & { electronAPI?: typeof electronAPI }).electronAPI = electronAPI;

export {};
