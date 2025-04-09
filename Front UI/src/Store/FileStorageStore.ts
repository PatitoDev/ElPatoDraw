import { create } from 'zustand';
import { FileChild, Folder, FolderChild } from '../types/File';
import { MetadataApi } from '../api/MetadataApi';
import { createRef, RefObject } from 'react';

export interface FileStorageStore {
  itemContainerRef: RefObject<HTMLDivElement>,

  selectedItemIds: Array<string>,
  getSelectedItems: () => ({
    files: Array<FileChild>,
    folders: Array<FolderChild>
  }),
  clearSelection: () => void,
  addToSelection: (fileId: string) => void,
  removeFromSelection: (fileId: string) => void,
  toggleSelection: (fileId: string) => void,
  setSelectedItemsIds: (fileIds: Array<string>) => void,

  fileIdCurrentlyEditing: string | null,
  setFileIdCurrentEditing: (fileId: string | null) => void,

  activeFiles: Array<FileChild>,
  setActiveFiles: (files: Array<FileChild>) => void,

  currentFolder: Folder | null,
  changeToFolder: (folderId: string | null) => Promise<void>,
  navigateToParentFolder: () => Promise<void>,

  showExplorer: () => Promise<void>,
  openFile: (fileId : string) => void,
  closeFile: (fileId: string) => void,

  createNewFile: () => Promise<void>,
  createNewFolder: () => Promise<void>

  moveSelectionToFolder: (targetId: string | null) => Promise<void>,
  setIsMovingItems: (value: boolean) => void,
  isMovingItems: boolean
}

export const useFileStorageStore = create<FileStorageStore>()((set,get) => ({
  itemContainerRef: createRef<HTMLDivElement>(),

  fileIdCurrentlyEditing: null,
  setFileIdCurrentEditing: (id) => set({ fileIdCurrentlyEditing: id }),

  activeFiles: [],
  setActiveFiles: (files) => set({ activeFiles: files }),

  currentFolder: null,
  changeToFolder: async (folderId) => {
    const folder = await MetadataApi.getFolder(folderId);
    if (folder === null) return;
    set({ currentFolder: folder });
  },

  navigateToParentFolder: async () => {
    const parentFolderId = get().currentFolder?.metadata?.parentFolder?.id;
    await get().changeToFolder(parentFolderId ?? null);
  },

  showExplorer: async () => {
    set({ fileIdCurrentlyEditing: null })
  },

  openFile: (fileId) => {
    const activeFiles = get().activeFiles;
    if (activeFiles.find(f => f.id === fileId)) {
      set({ fileIdCurrentlyEditing: fileId });
      return;
    }

    const file = get().currentFolder?.files.find(f => f.id === fileId);
    if (!file) return;

    set({ 
      fileIdCurrentlyEditing: file.id,
      activeFiles: [...activeFiles, file]
    });
  },

  closeFile: (fileId) => {
    set({
      fileIdCurrentlyEditing: null,
      activeFiles: get()
        .activeFiles
        .filter(f => f.id !== fileId)
    });
  },

  createNewFolder: async () => {
    const currentFolderId = get().currentFolder?.metadata?.id;
    await MetadataApi.createFolder('New folder', '#FFFB96', currentFolderId);
    await get().changeToFolder(currentFolderId ?? null);
  },

  createNewFile: async () => {
    const currentFolderId = get().currentFolder?.metadata?.id;
    const createdFileId = await MetadataApi.createFile('New Drawing', 'Excalidraw', currentFolderId);

    await get().changeToFolder(currentFolderId ?? null);
    if (createdFileId)
      get().openFile(createdFileId);
  },

  selectedItemIds: [],

  setSelectedItemsIds: (itemIds) => {set({ selectedItemIds: itemIds })},

  addToSelection: (fileId: string) => {
    set(state => ({ selectedItemIds: [...state.selectedItemIds, fileId]}));
  },

  toggleSelection: (fileId: string) => {
    set(state => ({ 
      selectedItemIds: 
      state.selectedItemIds.includes(fileId) ? 
        state.selectedItemIds.filter(id => id !== fileId) :
        [...state.selectedItemIds, fileId]
    }));
  },

  clearSelection: () => {
    set({ selectedItemIds: [] })
  },

  removeFromSelection: (fileId: string) => {
    set(state => ({
      selectedItemIds: state.selectedItemIds.filter(id => id !== fileId)}
    ));
  },

  getSelectedItems: () => {
    const folder = get().currentFolder;
    const selectedIds = get().selectedItemIds;
    if (!folder) return { files: [], folders: [] };
    return {
      files: folder.files.filter(f => selectedIds.includes(f.id)),
      folders: folder.folders.filter(f => selectedIds.includes(f.id)),
    }
  },

  isMovingItems: false,
  setIsMovingItems: (value) => set({ isMovingItems: value }),
  moveSelectionToFolder: async (targetFolderId) => {
    const selectedItemIds = get().selectedItemIds;
    if (selectedItemIds.length === 0) return;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    const foldersToMove = currentFolder.folders.filter(f => selectedItemIds.includes(f.id));
    const filesToMove = currentFolder.files.filter(f => selectedItemIds.includes(f.id));

    await MetadataApi.updateFiles(filesToMove.map((file) => ({
      name: file.name,
      id: file.id,
      parentFolderId: targetFolderId ?? undefined
    })));


    // TODO - move folders

    await get().changeToFolder(get().currentFolder?.metadata?.id ?? null);
  }

}));