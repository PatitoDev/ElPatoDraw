import { Icon } from '@iconify/react';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import * as S from './styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModalStore } from '../../Store/ModalStore';

export const ContextMenu = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isOnHomeTab = useFileStorageStore(state => state.fileIdCurrentlyEditing === null);
  const isDeleteModalOpen = useModalStore(state => state.isOpen);
  const isMenuEnabled = isOnHomeTab && !isDeleteModalOpen;

  const createNewFile = useFileStorageStore(state => state.createNewFile);
  const createNewFolder = useFileStorageStore(state => state.createNewFolder);
  const openFile = useFileStorageStore(store => store.openFile);
  const openFolder = useFileStorageStore(store => store.changeToFolder);
  const editSelectionName = useFileStorageStore(store => store.editSelectionName);
  const openDeleteModal = useModalStore(store => store.openModal);

  const selectedItemIds = useFileStorageStore(store => store.selectedItemIds);
  const currentFolder = useFileStorageStore(store => store.currentFolder);

  const { hasSelectedFiles } = useMemo(() => ({
    hasSelectedFiles: (currentFolder?.files ?? [])
      .filter(f => selectedItemIds.includes(f.id)).length > 0,
  }), [currentFolder, selectedItemIds]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onContextMenu = (e:MouseEvent) => {
      if (!isMenuEnabled) return;
      if (!containerRef.current) return;
      e.preventDefault();
      setIsOpen(true);
      const x = Math.min(e.pageX, window.innerWidth - 200);
      const y = Math.min(e.pageY, window.innerHeight - 150);
      containerRef.current.style.top = `${y}px`;
      containerRef.current.style.left = `${x}px`;
    };

    const onClick = (e:MouseEvent) => {
      if (e.target === containerRef.current ||
          containerRef.current?.contains(e.target as HTMLElement)
      ) return;
      setIsOpen(false);
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('mousedown', onClick);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('mousedown', onClick);
    };
  }, [setIsOpen, isMenuEnabled]);

  const onOpenClick = useCallback(() => {
    for (const id of selectedItemIds) {
      openFile(id);
    }
    setIsOpen(false);
  }, [openFile, selectedItemIds]);

  const onSingleItemOpenClick = useCallback(() => {
    const itemId = selectedItemIds[0];
    if (!itemId) return;
    setIsOpen(false);
    const file = currentFolder?.files.find(f => f.id === itemId);

    if (file) {
      openFile(itemId);
      return;
    }

    const folder = currentFolder?.folders.find(f => f.id === itemId);
    if (folder) {
      openFolder(itemId);
    }

  }, [openFolder, currentFolder, openFile, selectedItemIds]);

  const onRenameClick = useCallback(() => {
    editSelectionName();
    setIsOpen(false);
  }, [editSelectionName]);

  const onDeleteClick = useCallback(() => {
    openDeleteModal();
    setIsOpen(false);
  }, [openDeleteModal]);

  const onCreateNewFileClick = useCallback(() => {
    createNewFile();
    setIsOpen(false);
  }, [createNewFile]);

  const onCreateNewFolderClick = useCallback(() => {
    createNewFolder();
    setIsOpen(false);
  }, [createNewFolder]);

  return (
    <S.MenuContainer ref={containerRef} $isOpen={isOpen} >
      {selectedItemIds.length === 1 && (
        <>
          <button type='button' onClick={onSingleItemOpenClick}>
            <Icon icon='mingcute:cursor-2-line' />
            Open
          </button>
          <button type='button' onClick={onRenameClick}>
            <Icon icon='gg:rename' />
            Rename
          </button>
          <button type='button' onClick={onDeleteClick}>
            <Icon icon='mingcute:delete-2-line' />
            Delete
          </button>
        </>
      )}

      {selectedItemIds.length > 1 && hasSelectedFiles && (
        <button type='button' onClick={onOpenClick}>
          <Icon icon='mingcute:cursor-2-line' />
          Open Selection
        </button>
      )}

      {selectedItemIds.length > 1 && (
        <>
          <button type='button' onClick={onDeleteClick}>
            <Icon icon='mingcute:delete-2-line' />
            Delete Selection
          </button>
        </>
      )}

      {selectedItemIds.length === 0 && (
        <>
          <button type='button' onClick={onCreateNewFileClick}>
            <Icon icon='mingcute:file-new-line' />
            New Drawing
          </button>
          <button type='button' onClick={onCreateNewFolderClick}>
            <Icon icon='mingcute:new-folder-line' />
            New Folder
          </button>
        </>
      )}
    </S.MenuContainer>
  );
};