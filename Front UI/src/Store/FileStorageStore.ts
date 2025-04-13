import { create } from 'zustand';
import { FileChild, Folder, FolderChild } from '../types/File';
import { MetadataApi } from '../api/MetadataApi';
import { createRef, RefObject } from 'react';

export interface FileStorageStore {
  itemContainerRef: RefObject<HTMLDivElement>,

  fileIdCurrentlyEditing: string | null,
  setFileIdCurrentEditing: (fileId: string | null) => void,

  activeFiles: Array<FileChild>,
  setActiveFiles: (files: Array<FileChild>) => void,

  currentFolder: Folder | null,
  changeToFolder: (folderId: string | null) => Promise<void>,
  navigateToParentFolder: () => Promise<void>,
  refreshCurrentFolder: () => Promise<void>,

  showExplorer: () => Promise<void>,
  openFile: (fileId : string) => void,
  closeFile: (fileId: string) => void,

  createNewFile: () => Promise<void>,
  createNewFolder: () => Promise<void>

  isDragging: boolean
  setIsDragging: (value: boolean) => void,
  deleteSelection: () => Promise<void>,
  moveSelectionToFolder: (targetId: string | null) => Promise<void>,
  selectedItemIds: Array<string>,
  getSelectedItems: () => ({
    files: Array<FileChild>,
    folders: Array<FolderChild>
  }),
  clearSelection: () => void,
  addToSelection: (fileId: string) => void,
  removeFromSelection: (fileId: string) => void,
  setSelectedItemsIds: (fileIds: Array<string>) => void,

  fileIdCurrentlyEditingName : string | null,
  editSelectionName: () => void,
  clearFileNameEditing: () => void,

  updateColorToSelection: (color: string) => void,
}

export const useFileStorageStore = create<FileStorageStore>()((set,get) => ({
  itemContainerRef: createRef<HTMLDivElement>(),

  fileIdCurrentlyEditing: null,
  setFileIdCurrentEditing: (id) => set({ fileIdCurrentlyEditing: id }),

  activeFiles: [],
  setActiveFiles: (files) => set({ activeFiles: files }),

  refreshCurrentFolder: async () => {
    const folderId = get().currentFolder?.metadata?.id;
    await get().changeToFolder(folderId ?? null);
  },

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
    await MetadataApi.createFolder('New folder', currentFolderId);
    await get().refreshCurrentFolder();
  },

  createNewFile: async () => {
    const currentFolderId = get().currentFolder?.metadata?.id;
    const createdFileId = await MetadataApi.createFile('New Drawing', 'Excalidraw', currentFolderId);
    await get().refreshCurrentFolder();

    if (createdFileId) {
      get().openFile(createdFileId);
    }
  },

  selectedItemIds: [],

  setSelectedItemsIds: (itemIds) => {set({ selectedItemIds: itemIds })},

  addToSelection: (fileId: string) => {
    set(state => ({ selectedItemIds: [...state.selectedItemIds, fileId]}));
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

  deleteSelection: async () => {
    const selectedItemIds = get().selectedItemIds;
    if (selectedItemIds.length === 0) return;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    const foldersTodelete = currentFolder.folders.filter(f => selectedItemIds.includes(f.id));
    const filesToDelete = currentFolder.files.filter(f => selectedItemIds.includes(f.id));
    await MetadataApi.deleteFiles(filesToDelete.map(f => f.id));
    await MetadataApi.deleteFolders(foldersTodelete.map(f => f.id));
    get().clearSelection();
    await get().refreshCurrentFolder();
  },

  moveSelectionToFolder: async (targetFolderId) => {
    const selectedItemIds = get().selectedItemIds;
    if (selectedItemIds.length === 0) return;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    // remove target to avoid move folder into itself and creating a black hole
    const itemIdsToMove = selectedItemIds.filter(id => id !== targetFolderId);

    const foldersToMove = currentFolder.folders.filter(f => itemIdsToMove.includes(f.id));
    const filesToMove = currentFolder.files.filter(f => itemIdsToMove.includes(f.id));

    await MetadataApi.updateFiles(filesToMove.map((file) => ({
      name: file.name,
      id: file.id,
      parentFolderId: targetFolderId ?? undefined
    })));

    await MetadataApi.updateFolders(foldersToMove.map((folder) => ({
      name: folder.name,
      id: folder.id,
      color: folder.color,
      parentFolderId: targetFolderId ?? undefined,
    })));

    get().clearSelection();
    await get().refreshCurrentFolder();
  },

  isDragging: false,
  setIsDragging: (value) => set({ isDragging: value }),

  fileIdCurrentlyEditingName : null,
  editSelectionName: () => {
    const itemIds = get().selectedItemIds;
    if (itemIds.length !== 1) return;
    const fileId = itemIds[0];
    set({ fileIdCurrentlyEditingName: fileId });
  },
  clearFileNameEditing: () => {
    set({ fileIdCurrentlyEditingName: null })
  },

  updateColorToSelection: (color: string) => {
    const selectedItemIds = get().selectedItemIds;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    const updatedFolders = currentFolder.folders.map(f => 
      selectedItemIds.includes(f.id) ?
      ({...f, color}) :
      {...f}
    );

    const updatedFiles = currentFolder.files.map(f => 
      selectedItemIds.includes(f.id) ?
      ({...f, color}) :
      {...f}
    );
    const updatedCurrentFolder: Folder = {...currentFolder, folders: updatedFolders, files: updatedFiles };

    set(({ currentFolder: updatedCurrentFolder }));
  },
}));