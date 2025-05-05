import { StateCreator } from 'zustand';
import { FileActionStoreSlice, NavigationFileStoreSlice, SelectionStoreSlice } from './types';
import { createRef } from 'react';

export const useSelectionStoreSlice: StateCreator<
SelectionStoreSlice & NavigationFileStoreSlice & FileActionStoreSlice,
[],
[],
SelectionStoreSlice
> = (set, get) => ({
  itemContainerRef: createRef<HTMLDivElement>(),

  isDragging: false,
  setIsDragging: (value) => set({ isDragging: value }),

  selectedItemIds: [],
  selectAll: () => {
    const folder = get().currentFolder;
    if (!folder) return;

    get().setSelectedItemsIds(
      [...folder.files.map(f => f.id), ...folder.folders.map(f => f.id)]
    );
  },
  clearSelection: () => {
    set({ selectedItemIds: [] });
  },
  addToSelection: (fileId: string) => {
    set(state => ({ selectedItemIds: [...state.selectedItemIds, fileId] }));
  },
  removeFromSelection: (fileId: string) => {
    set(state => ({
      selectedItemIds: state.selectedItemIds.filter(id => id !== fileId)
    }
    ));
  },
  setSelectedItemsIds: (itemIds) => { set({ selectedItemIds: itemIds }); },
});