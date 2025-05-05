import { RefObject } from 'react';
import { FileChild, FileType, Folder, FolderChild } from '@Types/File';

export interface SelectionStoreSlice {
  itemContainerRef: RefObject<HTMLDivElement>,

  isDragging: boolean
  setIsDragging: (value: boolean) => void,

  selectedItemIds: Array<string>,
  clearSelection: () => void,
  addToSelection: (fileId: string) => void,
  removeFromSelection: (fileId: string) => void,
  setSelectedItemsIds: (fileIds: Array<string>) => void,
}

export interface FilterOptions {
  caseSensitive: boolean
}

export interface NavigationFileStoreSlice {
  currentFolder: Folder | null,
  changeToFolder: (folderId: string | null) => Promise<void>,
  navigateToParentFolder: () => Promise<void>,
  refreshCurrentFolder: () => Promise<void>,

  isFilterActive: boolean,
  setIsFilterActive: (value: boolean) => void,
  filteredValue: string,
  filteredRegexValue: RegExp | null,
  setFilteredValue: (value: string) => void,
  filterOptions: FilterOptions,
  setFilterOptions: (value: FilterOptions) => void,

  showExplorer: () => Promise<void>,
  openFile: (fileId: string, shouldFocus?: boolean) => void,
  closeFile: (fileId: string) => Promise<void>,

  openedFiles: Array<FileChild>,
  setOpenedFiles: (files: Array<FileChild>) => void
}

export interface FileActionStoreSlice {
  focusedFileId: string | null,
  setFocusedFileId: (fileId: string | null) => void,

  createNewFile: (fileType: FileType) => Promise<void>,
  createNewFolder: () => Promise<void>

  editingNameFileId: string | null,
  editSelectedFileName: () => void,
  commitEditedFileName: (fileId: string, fileName: string) => Promise<void>,
  cancelFileNameEditing: () => void,

  moveSelectionToFolder: (targetId: string | null) => Promise<void>,
  deleteSelection: () => Promise<void>,
  getSelectedItems: () => ({
    files: Array<FileChild>,
    folders: Array<FolderChild>
  }),

  commitSelectionColor: () => Promise<void>
  selectedColor: {
    selectedIds: Array<string>,
    color: string
  } | null,
  setSelectedColor: (color: string) => void,
}