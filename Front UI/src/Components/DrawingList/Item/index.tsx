import React, { useEffect, useRef, useState } from 'react';
import { useFileStorageStore } from '../../../Store/FileStorageStore';
import { DuckFolder } from './DuckFolder';
import * as S from './styles';
import { Icon } from '@iconify/react';
import { DraggedItem } from '../../DraggedItem';

export interface ItemProps {
  id: string,
  name: string,
  color: string,
  type: 'File' | 'Folder';
  index: number
}

export const Item = ({
  id,
  name,
  color,
  type,
  index
}: ItemProps) => {
  const inputNameRef = useRef<HTMLInputElement>(null);
  const [inputNameValue, setInputNameValue] = useState<string>(name);

  const isSelected = useFileStorageStore(state =>
    !!state.selectedItemIds.find(selectedId => selectedId === id)
  );
  const overrideColor = useFileStorageStore(state =>
    state.selectedItemIds.includes(id) ?
      state.selectedColor?.color :
      color
  );
  const isEditingName = useFileStorageStore(state => state.fileIdCurrentlyEditingName === id);
  const clearNameEditingId = useFileStorageStore(state => state.clearFileNameEditing);
  const updateFileName = useFileStorageStore(state => state.updateFileName);

  const clearSelection = useFileStorageStore(state => state.clearSelection);
  const addToSelection = useFileStorageStore(state => state.addToSelection);
  const removeFromSelection = useFileStorageStore(state => state.removeFromSelection);
  const openFile = useFileStorageStore(state => state.openFile);
  const openFolder = useFileStorageStore(state => state.changeToFolder);
  const moveSelectionToFolder = useFileStorageStore(state => state.moveSelectionToFolder);

  const selectionItemIds = useFileStorageStore(state => state.selectedItemIds);
  const isSomethingDragging = useFileStorageStore(state => state.isDragging);
  const setIsDragging = useFileStorageStore(state => state.setIsDragging);

  const isDragging = isSomethingDragging && selectionItemIds.includes(id);

  const [isHoveringItem, setIsHoveringItem] = useState<boolean>(false);

  const draggedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputNameValue(name);
  }, [name]);

  const handleOpen = () => {
    type === 'Folder' ? openFolder(id) : openFile(id)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!e.ctrlKey)
      clearSelection();

    (e.ctrlKey && isSelected) ? removeFromSelection(id) : addToSelection(id);
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (isEditingName) return;

    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (draggedItemRef.current) {
      e.dataTransfer.setDragImage(draggedItemRef.current, 0, 0);
    }

    setIsDragging(true);
    if (isSelected) return;

    if (!e.ctrlKey)
      clearSelection();

    (e.ctrlKey && isSelected) ? removeFromSelection(id) : addToSelection(id);
  }

  const handleDragEnd = () => {
    setIsDragging(false);
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'File') return;

    e.preventDefault();
    setIsHoveringItem(true);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (type === 'File') return;
    e.preventDefault();
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHoveringItem(false);
  }

  const handleDrag = () => {}

  const handleDrop = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    moveSelectionToFolder(id);
    setIsHoveringItem(false);
  }

  const onInputClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    if (!isEditingName || !inputNameRef.current) return;
    inputNameRef.current.focus();
    inputNameRef.current.select();
  }, [isEditingName])

  useEffect(() => {
    if (!isEditingName || !inputNameRef.current) return;
    const state = { handled: false };

    let valueCleanedUp = inputNameValue.trim();
    valueCleanedUp = valueCleanedUp.length > 1 ? valueCleanedUp : name;

    const onKeyUp = async (e: KeyboardEvent) => {
      e.stopPropagation();
      if (state.handled) return;
      if (e.key === 'Escape') {
        state.handled = true;
        setInputNameValue(name);
        clearNameEditingId();
      }

      if (e.key === 'Enter') {
        state.handled = true;
        clearNameEditingId();
        await updateFileName(id, valueCleanedUp);
      }
    };

    const onBlur = async () => {
      if (state.handled) return;
      if (!isEditingName) return;
      state.handled = true;
      clearNameEditingId();
      await updateFileName(id, valueCleanedUp);
    };

    inputNameRef.current.addEventListener('keyup', onKeyUp);
    inputNameRef.current.addEventListener('blur', onBlur);
    return () => {
      if (!inputNameRef.current) return;
      inputNameRef.current.removeEventListener('keyup', onKeyUp);
      inputNameRef.current.removeEventListener('blur', onBlur);
    };
  }, [isEditingName, clearNameEditingId, name, inputNameValue])

  return (
    <S.Container
      $index={index}
      data-id={id}
      data-droppable={type === 'Folder'}
      onDoubleClick={handleOpen}
      onTouchEnd={handleOpen}
      onClick={handleClick}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      draggable
      data-color={overrideColor ?? color}
      $isSelected={isSelected}
      $isHovering={isHoveringItem}
      $isDragging={isDragging}
    >
      <DraggedItem ref={draggedItemRef} />
      {type === 'Folder' && <DuckFolder color={overrideColor ?? color} />}
      {type === 'File' && <Icon data-color={overrideColor ?? color} icon="mingcute:file-fill" />}
      {isEditingName ?
        <input
          minLength={1}
          maxLength={200}
          ref={inputNameRef}
          onDoubleClick={onInputClick}
          value={inputNameValue}
          onChange={e => setInputNameValue(e.target.value)}
        /> :
        <S.Name>{name}</S.Name>
      }
    </S.Container>
  )
}