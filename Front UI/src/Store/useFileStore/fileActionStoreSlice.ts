import { StateCreator } from 'zustand';
import { FileActionStoreSlice, NavigationFileStoreSlice, SelectionStoreSlice } from './types';
import { MetadataApi } from '@Api/MetadataApi';
import { FileType } from '@Types/File';

export const useFileActionStoreSlice: StateCreator<
SelectionStoreSlice & NavigationFileStoreSlice & FileActionStoreSlice,
[],
[],
FileActionStoreSlice
> = (set, get) => ({
  focusedFileId: null,
  setFocusedFileId: (id) => set({ focusedFileId: id }),

  createNewFile: async (fileType: FileType) => {
    const currentFolderId = get().currentFolder?.metadata?.id;
    const createdFileId = await MetadataApi.createFile('New Drawing', fileType, currentFolderId);
    await get().refreshCurrentFolder();

    if (!createdFileId) return;
    set({
      editingNameFileId: createdFileId,
      selectedItemIds: [createdFileId]
    });
  },
  createNewFolder: async () => {
    const currentFolderId = get().currentFolder?.metadata?.id;
    const createdFolderId = await MetadataApi.createFolder('New Folder', currentFolderId);
    await get().refreshCurrentFolder();
    if (!createdFolderId) return;
    set({
      editingNameFileId: createdFolderId,
      selectedItemIds: [createdFolderId]
    });
  },

  editingNameFileId: null,
  editSelectedFileName: () => {
    const itemIds = get().selectedItemIds;
    if (itemIds.length !== 1) return;
    const fileId = itemIds[0];
    set({ editingNameFileId: fileId });
  },
  commitEditedFileName: async (fileId: string, fileName: string) => {
    const file = get().currentFolder?.files.find(f => f.id === fileId);
    const currentFolderId = get().currentFolder?.metadata?.id;

    if (file) {
      await MetadataApi.updateFiles([{
        id: file.id,
        color: file.color,
        parentFolderId: currentFolderId,
        name: fileName
      }]);
    }

    const folder = get().currentFolder?.folders.find(f => f.id === fileId);
    if (folder) {
      await MetadataApi.updateFolders([{
        id: folder.id,
        name: fileName,
        color: folder.color,
        parentFolderId: currentFolderId
      }]);
    }

    await get().refreshCurrentFolder();
  },
  cancelFileNameEditing: () => {
    set({ editingNameFileId: null });
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
      color: file.color,
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

  deleteSelection: async () => {
    const selectedItemIds = get().selectedItemIds;
    if (selectedItemIds.length === 0) return;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    const foldersToDelete = currentFolder.folders.filter(f => selectedItemIds.includes(f.id));
    const filesToDelete = currentFolder.files.filter(f => selectedItemIds.includes(f.id));
    await MetadataApi.deleteFiles(filesToDelete.map(f => f.id));
    await MetadataApi.deleteFolders(foldersToDelete.map(f => f.id));
    get().clearSelection();
    await get().refreshCurrentFolder();
  },

  getSelectedItems: () => {
    const folder = get().currentFolder;
    const selectedIds = get().selectedItemIds;
    if (!folder) return { files: [], folders: [] };
    return {
      files: folder.files.filter(f => selectedIds.includes(f.id)),
      folders: folder.folders.filter(f => selectedIds.includes(f.id)),
    };
  },

  commitSelectionColor: async () => {
    const colorData = get().selectedColor;
    if (colorData === null) return;
    const { color, selectedIds } = colorData;
    const currentFolder = get().currentFolder;
    if (!currentFolder) return;

    const updatedFolders = currentFolder
      .folders
      .filter(f => selectedIds.includes(f.id))
      .map(f => ({
        ...f,
        parentFolderId: currentFolder.metadata?.id,
        color
      }));

    const updatedFiles = currentFolder
      .files
      .filter(f => selectedIds.includes(f.id))
      .map(f => ({
        ...f,
        parentFolderId: currentFolder.metadata?.id,
        color
      }));

    await MetadataApi.updateFiles(updatedFiles);
    await MetadataApi.updateFolders(updatedFolders);
    set({ selectedColor: null });
    get().refreshCurrentFolder();
  },
  // Folder/file color picker
  selectedColor: null,
  setSelectedColor: (color) => {
    set({
      selectedColor: {
        color,
        selectedIds: [...get().selectedItemIds]
      }
    });
    return;
  },
});