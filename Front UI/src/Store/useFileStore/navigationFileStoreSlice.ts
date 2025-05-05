import { StateCreator } from 'zustand';
import { FileActionStoreSlice, FilterOptions, NavigationFileStoreSlice, SelectionStoreSlice } from './types';
import { MetadataApi } from '@Api/MetadataApi';
import { useFileContentStore } from '@Store/useFileContentStore';

export const useNavigationFileStoreSlice: StateCreator<
SelectionStoreSlice & NavigationFileStoreSlice & FileActionStoreSlice,
[],
[],
NavigationFileStoreSlice
> = (set, get) => ({
  currentFolder: null,
  changeToFolder: async (folderId) => {
    const folder = await MetadataApi.getFolder(folderId);
    if (folder === null) return;
    const isRefreshing = (get().currentFolder?.metadata?.id ?? null) === folderId;

    set({ currentFolder: folder });
    set(prev => ({ openedFiles: [
      ...prev.openedFiles.map(f => folder.files.find(file => file.id === f.id) ?? f)
    ]}));

    if (!isRefreshing) {
      // clear selection on navigation to avoid modifying items out of view;
      set({ selectedItemIds: [] });
    }
  },
  navigateToParentFolder: async () => {
    const parentFolderId = get().currentFolder?.metadata?.parentFolder?.id;
    await get().changeToFolder(parentFolderId ?? null);
  },
  refreshCurrentFolder: async () => {
    const folderId = get().currentFolder?.metadata?.id;
    await get().changeToFolder(folderId ?? null);
  },

  isFilterActive: false,
  setIsFilterActive: (value) => {
    set({ isFilterActive: value });
  },
  filteredValue: '',
  filteredRegexValue: null,
  setFilteredValue: (value) => {
    const valueEscaped = value.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');

    const regexFlags = get().filterOptions.caseSensitive ? 'g' : 'gi';
    const regex = value.length === 0 ? null : new RegExp(`(${valueEscaped})`, regexFlags);
    set({ filteredValue: value, filteredRegexValue: regex });
  },
  filterOptions: { caseSensitive: false },
  setFilterOptions: ( value: FilterOptions ) => {
    set({ filterOptions: value });
    // refresh the filter value to update the regex flags
    get().setFilteredValue(get().filteredValue);
  },

  showExplorer: async () => {
    set({ focusedFileId: null });
  },

  openFile: (fileId, shouldFocus = true) => {
    const activeFiles = get().openedFiles;
    if (activeFiles.find(f => f.id === fileId)) {
      if (shouldFocus) {
        set({ focusedFileId: fileId });
      }
      return;
    }

    const file = get().currentFolder?.files.find(f => f.id === fileId);
    if (!file) return;

    set(prev => ({
      focusedFileId: shouldFocus ? file.id : prev.focusedFileId,
      openedFiles: [...activeFiles, file]
    }));
  },
  closeFile: async (fileId) => {
    set({
      focusedFileId: null,
      openedFiles: get()
        .openedFiles
        .filter(f => f.id !== fileId)
    });
    await useFileContentStore.getState().closeAndSave(fileId);
  },

  openedFiles: [],
  setOpenedFiles: (files) => set({ openedFiles: files }),
});