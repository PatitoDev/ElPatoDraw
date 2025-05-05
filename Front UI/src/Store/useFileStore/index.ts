import { create } from 'zustand';
import { useNavigationFileStoreSlice } from './navigationFileStoreSlice';
import { useSelectionStoreSlice } from './selectionStoreSlice';
import { FileActionStoreSlice, NavigationFileStoreSlice, SelectionStoreSlice } from './types';
import { useFileActionStoreSlice } from './fileActionStoreSlice';

export const useFileStore = create<
  NavigationFileStoreSlice &
  SelectionStoreSlice &
  FileActionStoreSlice
>()((...a) => ({
  ...useNavigationFileStoreSlice(...a),
  ...useSelectionStoreSlice(...a),
  ...useFileActionStoreSlice(...a)
}));