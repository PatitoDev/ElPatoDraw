import { useEvent } from '../../hooks/useEvent';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { useModalStore } from '../../Store/ModalStore';

export const FolderKeybinds = () => {
  const isEditingName = useFileStorageStore(store => !!store.fileIdCurrentlyEditingName);
  const selectedItemIds = useFileStorageStore(store => store.selectedItemIds);
  const openModal = useModalStore(store => store.openModal);

  const openFile = useFileStorageStore(store => store.openFile);
  const changeToFolder = useFileStorageStore(store => store.changeToFolder);
  const getSelectedItems = useFileStorageStore(store => store.getSelectedItems);

  const editSelectionName = useFileStorageStore(store => store.editSelectionName);

  useEvent(document, 'keyup', (e: KeyboardEvent) => {
    if (isEditingName) return;
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
      editSelectionName();
      return;
    }
  });


  return null;
}