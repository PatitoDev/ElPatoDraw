import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { Point, utils } from './utils';

const useEvent = <T extends EventTarget, E extends Event>(
  elRef: MutableRefObject<T | null> | T,
  event: keyof HTMLElementEventMap,
  handler: (e: E) => void
  ) => {

  const callbackRef = useRef(handler);

  useEffect(() => {
    callbackRef.current = handler;
  }, [handler])

  useEffect(() => {
    const isEl = (
      elRef instanceof HTMLElement ||
      elRef instanceof Window ||
      elRef instanceof Document
    );

    const el = isEl ? elRef as T : (elRef as MutableRefObject<T | null>).current;

    const action = (e: Event) => {
      callbackRef.current(e as E);
    }

    el?.addEventListener(event, action);

    return () => {
      el?.removeEventListener(event, action);
    }
  }, [callbackRef, elRef, event])
}

export const SelectionBox = () => {
  const draggedItemsSquareRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const clearSelection = useFileStorageStore(state => state.clearSelection);
  const isOnHomeTab = useFileStorageStore(state => state.fileIdCurrentlyEditing === null);
  const itemContainerRef = useFileStorageStore(state => state.itemContainerRef);
  const setSelectedItemIds = useFileStorageStore(state => state.setSelectedItemsIds);
  const getSelectedItems = useFileStorageStore(state => state.getSelectedItems);
  const setIsMovingItems = useFileStorageStore(state => state.setIsMovingItems)
  const moveSelectionToFolder = useFileStorageStore(state => state.moveSelectionToFolder);
  const addToSelection = useFileStorageStore(state => state.addToSelection);

  const selectedItemIds = useFileStorageStore(state => state.selectedItemIds);

  const [hasClickedOnFile, setHasClickedOnFile] = useState(false);
  const [clickedStartPosition, setClickedStartPosition] = useState<Point | null>(null);
  const [selectedItemsOnClick, setSelectedItemsOnClick] = useState<Array<string>>([]);
  const [isMovingFiles, setIsMovingFiles] = useState(false);
  const [isSelectingFiles, setIsSelectingFiles] = useState(false);

  useEvent(document, 'mousedown', useCallback((e: MouseEvent) => {
    if (!isOnHomeTab) return;
    const fileUnderMouse = utils.getFileUnderMouse(itemContainerRef, e);
    setHasClickedOnFile(!!fileUnderMouse);
    setClickedStartPosition({ x: e.clientX, y: e.clientY });
    setSelectedItemsOnClick([...selectedItemIds]);
  }, [isOnHomeTab, selectedItemIds, itemContainerRef]));

  useEvent(document, 'mouseup', useCallback((e: MouseEvent) => {
    if (!isOnHomeTab) return;

    setHasClickedOnFile(false);
    setClickedStartPosition(null);
    if (squareRef.current) {
      // move to state
      squareRef.current.style.display = 'none';
    }
    if (draggedItemsSquareRef.current){
      draggedItemsSquareRef.current.style.display = 'none';
    }

    if (isMovingFiles && (e.target as HTMLElement).dataset.droppable) {
      const targetId = (e.target as HTMLElement).dataset.id;
      console.log('Droppded to ', targetId);
      moveSelectionToFolder(targetId ?? null);
      return;
    }

    if (!isMovingFiles && !isSelectingFiles) {
      // clear selectin on clicking outside
      if (e.target === itemContainerRef.current && !e.ctrlKey) {
        clearSelection()
        return;
      }
      console.log('click');
      const fileIdUnderMouse = utils.getFileUnderMouse(itemContainerRef, e);
      if (fileIdUnderMouse) {
        // check if its selected first
        addToSelection(fileIdUnderMouse);
      }
    }

  }, [isOnHomeTab, itemContainerRef, isMovingFiles, draggedItemsSquareRef, squareRef, isSelectingFiles]));

  useEvent(document, 'mousemove', useCallback((e: MouseEvent) => {
    if (!isOnHomeTab) return;
    if (!clickedStartPosition) return;

    setIsMovingFiles(hasClickedOnFile);
    setIsSelectingFiles(!hasClickedOnFile);
    if (hasClickedOnFile && draggedItemsSquareRef.current) {
      // move to state
      draggedItemsSquareRef.current.style.display = '';
      draggedItemsSquareRef.current.dataset.left = e.clientX.toString();
      draggedItemsSquareRef.current.dataset.top = e.clientY.toString();
    }

    const endPosition = { x: e.clientX, y: e.clientY };

    const width = Math.abs(endPosition.x - clickedStartPosition.x);
    const height = Math.abs(endPosition.y - clickedStartPosition.y);
    const x = Math.min(clickedStartPosition.x, endPosition.x);
    const y = Math.min(clickedStartPosition.y, endPosition.y);

    if (squareRef.current) {
      squareRef.current.style.display = '';
      squareRef.current.dataset.left = x.toString();
      squareRef.current.dataset.top = y.toString();
      squareRef.current.dataset.width = width.toString();
      squareRef.current.dataset.height = height.toString();
    }

    const selectedFileIds = utils.getFileIdsInsideBox(x, y, width, height, itemContainerRef);

    if (!e.ctrlKey) {
      setSelectedItemIds(selectedFileIds);
      return;
    }

    let finalSelection = [...selectedItemsOnClick];
    selectedFileIds.forEach((selectedId) => {
      if (finalSelection.includes(selectedId)) {
        finalSelection = finalSelection.filter(id => id !== selectedId);
        return;
      }
      finalSelection = [...finalSelection, selectedId];
    })

    setSelectedItemIds(finalSelection);

  }, [isOnHomeTab, itemContainerRef, draggedItemsSquareRef, squareRef, clickedStartPosition]));

  return (
    <S.Container>
      <S.SelectionArea style={{ display: 'none' }} ref={squareRef} />
      <S.DraggedItems style={{ display: 'none' }} ref={draggedItemsSquareRef} />
    </S.Container>
  )
}