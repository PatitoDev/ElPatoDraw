import { Icon } from '@iconify/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as S from './styles';
import { useFileStore } from '@Store/useFileStore';
import { useModalStore } from '@Store/useModalStore';

export const ContextMenu = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isOnHomeTab = useFileStore(state => state.focusedFileId === null);
  const isDeleteModalOpen = useModalStore(state => state.isOpen);
  const isMenuEnabled = isOnHomeTab && !isDeleteModalOpen;

  const createNewFile = useFileStore(state => state.createNewFile);
  const createNewFolder = useFileStore(state => state.createNewFolder);
  const openFile = useFileStore(store => store.openFile);
  const openFolder = useFileStore(store => store.changeToFolder);
  const editSelectedFileName = useFileStore(store => store.editSelectedFileName);
  const openDeleteModal = useModalStore(store => store.openModal);

  const selectedItemIds = useFileStore(store => store.selectedItemIds);
  const currentFolder = useFileStore(store => store.currentFolder);

  const { hasSelectedFiles } = useMemo(() => ({
    hasSelectedFiles: (currentFolder?.files ?? [])
      .filter(f => selectedItemIds.includes(f.id)).length > 0,
  }), [currentFolder, selectedItemIds]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (!isMenuEnabled) return;
      if (!containerRef.current) return;
      e.preventDefault();
      setIsOpen(true);
      const x = Math.min(e.pageX, window.innerWidth - 200);
      const y = Math.min(e.pageY, window.innerHeight - 150);
      containerRef.current.style.top = `${y}px`;
      containerRef.current.style.left = `${x}px`;
    };

    const onClick = (e: MouseEvent) => {
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
    editSelectedFileName();
    setIsOpen(false);
  }, [editSelectedFileName]);

  const onDeleteClick = useCallback(() => {
    openDeleteModal();
    setIsOpen(false);
  }, [openDeleteModal]);

  const onCreateNewFileClick = useCallback(() => {
    createNewFile('TlDraw');
    setIsOpen(false);
  }, [createNewFile]);

  const onCreateNewFolderClick = useCallback(() => {
    createNewFolder();
    setIsOpen(false);
  }, [createNewFolder]);

  return (
    <S.Container>
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
    </S.Container>
  );
};