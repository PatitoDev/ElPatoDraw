import { create } from 'zustand';
import { FileContentApi } from '@Api/FileContentApi';

export interface FileContentStore {
  fileContentMap: Record<string, string>,
  updateContent: (id: string, content: string) => void,
  save: (id: string) => Promise<void>,
  closeAndSave: (id: string) => Promise<void>,
}

export const useFileContentStore = create<FileContentStore>()((set, get) => ({
  fileContentMap: {},
  updateContent: (id, content) => {
    set(prev => (
      { fileContentMap: { ...prev.fileContentMap, [id]: content } }
    ));
  },
  closeAndSave: async (id) => {
    await get().save(id);
    set(prev => {
      delete prev.fileContentMap[id];
      return { fileContentMap: prev.fileContentMap };
    });
  },
  save: async (id) => {
    const content = get().fileContentMap[id];
    if (!content) return;

    await FileContentApi.updateFileContent(id, content);
    console.log('File saved ', id);
  },
}));
