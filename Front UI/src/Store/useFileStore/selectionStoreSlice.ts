import { StateCreator } from 'zustand';
import { FileActionStoreSlice, NavigationFileStoreSlice, SelectionStoreSlice } from './types';
import { createRef } from 'react';

export const useSelectionStoreSlice: StateCreator<
SelectionStoreSlice & NavigationFileStoreSlice & FileActionStoreSlice,
[],
[],
SelectionStoreSlice
> = (set) => ({
  itemContainerRef: createRef<HTMLDivElement>(),

  isDragging: false,
  setIsDragging: (value) => set({ isDragging: value }),

  selectedItemIds: [],
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