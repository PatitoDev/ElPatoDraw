import { useEvent } from './useEvent';
import { useFileStore } from '@Store/useFileStore';
import { useModalStore } from '@Store/useModalStore';

export const useFolderKeybinds = () => {
  const isOnHomeTab = useFileStore(state => state.focusedFileId === null);
  const isEditingName = useFileStore(store => !!store.editingNameFileId);
  const selectedItemIds = useFileStore(store => store.selectedItemIds);
  const openModal = useModalStore(store => store.openModal);

  const openFile = useFileStore(store => store.openFile);
  const changeToFolder = useFileStore(store => store.changeToFolder);
  const getSelectedItems = useFileStore(store => store.getSelectedItems);
  const selectAll = useFileStore(store => store.selectAll);

  const editSelectedFileName = useFileStore(store => store.editSelectedFileName);
  const setIsFilterActive = useFileStore(store => store.setIsFilterActive);

  useEvent(document, 'keydown', (e: KeyboardEvent) => {
    if (!isOnHomeTab) return;
    if (isEditingName) return;

    if (e.repeat) return;

    if (e.ctrlKey) {
      switch (e.key) {
      case 'f':
        e.preventDefault();
        setIsFilterActive(true);
        return;
      case 'a':
        e.preventDefault();
        selectAll();
        return;
      }
    }

    // actions after selecting something
    if (selectedItemIds.length === 0) return;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      openModal();
      return;
    }

    if (e.key === 'Enter') {
      const selectedItems = getSelectedItems();
      if (
        selectedItems.files.length > 0 &&
        selectedItems.folders.length > 0
      )
        return;

      selectedItems.files.forEach(f => openFile(f.id));

      if (selectedItems.folders.length === 1) {
        changeToFolder(selectedItems.folders[0].id);
      }
      return;
    }

    if (e.key === 'F2' && selectedItemIds.length === 1) {
      editSelectedFileName();
      return;
    }
  });

  return null;
};