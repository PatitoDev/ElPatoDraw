import { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { Point, utils } from './utils';
import { useEvent } from '../../hooks/useEvent';
import { LEFT_MOUSE_BTN } from '../../buttons';

export const SelectionBox = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const clearSelection = useFileStorageStore(state => state.clearSelection);
  const isOnHomeTab = useFileStorageStore(state => state.fileIdCurrentlyEditing === null);
  const itemContainerRef = useFileStorageStore(state => state.itemContainerRef);
  const setSelectedItemIds = useFileStorageStore(state => state.setSelectedItemsIds);

  const selectedItemIds = useFileStorageStore(state => state.selectedItemIds);

  const [clickedStartPosition, setClickedStartPosition] = useState<Point | null>(null);
  const [clickedEndPosition, setClickedEndPosition] = useState<Point | null>(null);

  const [selectedItemsOnClick, setSelectedItemsOnClick] = useState<Array<string>>([]);
  const [showSelectionArea, setShowSelectionArea] = useState(false);
  const [isCtrlClicked, setIsCtrlClicked] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState<Point | null>(null);

  useEvent(document, 'mousedown', useCallback((e: MouseEvent) => {
    if (e.button !== LEFT_MOUSE_BTN) return;
    if (!isOnHomeTab) return;
    if (e.target !== itemContainerRef.current) return;
    if (!itemContainerRef.current) return;

    const scrollTop = itemContainerRef.current.scrollTop;
    const containerBoundingRect = itemContainerRef.current.getBoundingClientRect();
    setClickedStartPosition({
      x: e.clientX - containerBoundingRect.left,
      y: e.clientY - containerBoundingRect.top + scrollTop
    });
    setSelectedItemsOnClick([...selectedItemIds]);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isOnHomeTab, selectedItemIds, itemContainerRef]));

  useEvent(document, 'mouseup', useCallback((e: MouseEvent) => {
    setClickedStartPosition(null);
    setClickedEndPosition(null);
    setLastMousePosition(null);
    setShowSelectionArea(false);
    if (!isOnHomeTab) return;

    // clear selectin on clicking outside
    if (
      clickedEndPosition === null &&
      e.target === itemContainerRef.current &&
      !e.ctrlKey
    ) {
      clearSelection();
      return;
    }

  }, [isOnHomeTab, itemContainerRef, clearSelection, clickedEndPosition]));

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isOnHomeTab) return;
    if (!clickedStartPosition) return;
    if (!itemContainerRef.current) return;

    setShowSelectionArea(true);

    const scrollTop = itemContainerRef.current.scrollTop;
    const containerBoundingRect = itemContainerRef.current.getBoundingClientRect();

    setClickedEndPosition({
      x: e.clientX - containerBoundingRect.left,
      y: e.clientY - containerBoundingRect.top + scrollTop
    });
    setLastMousePosition({ x: e.clientX, y: e.clientY });

  }, [isOnHomeTab, itemContainerRef, clickedStartPosition]);

  useEvent(document, 'keydown', (e: KeyboardEvent) => {
    setIsCtrlClicked(e.ctrlKey);
  });

  useEvent(document, 'keyup', (e: KeyboardEvent) => {
    setIsCtrlClicked(e.ctrlKey);
  });

  useEvent(document, 'mousemove', onMouseMove);
  useEvent(itemContainerRef, 'scroll', () => {
    if (!clickedStartPosition) return;
    if (!itemContainerRef.current) return;
    if (!lastMousePosition) return;

    const containerBoundingRect = itemContainerRef.current.getBoundingClientRect();
    setClickedEndPosition({
      x: lastMousePosition.x - containerBoundingRect.left,
      y: lastMousePosition.y - containerBoundingRect.top + itemContainerRef.current.scrollTop,
    });
  });

  useEffect(() => {
    if (!clickedEndPosition || !clickedStartPosition) return;

    const width = Math.abs(clickedEndPosition.x - clickedStartPosition.x);
    const height = Math.abs(clickedEndPosition.y - clickedStartPosition.y);
    const x = Math.min(clickedStartPosition.x, clickedEndPosition.x);
    const y = Math.min(clickedStartPosition.y, clickedEndPosition.y);

    if (squareRef.current) {
      squareRef.current.style.display = '';
      squareRef.current.style.left = `${x}px`;
      squareRef.current.style.top = `${y}px`;
      squareRef.current.style.width = `${width}px`;
      squareRef.current.style.height = `${height}px`;
    }

    const selectedFileIds = utils.getFileIdsInsideBox(x, y, width, height, itemContainerRef);

    if (!isCtrlClicked) {
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
    });

    setSelectedItemIds(finalSelection);

  }, [clickedStartPosition, clickedEndPosition, isCtrlClicked, itemContainerRef, selectedItemsOnClick, setSelectedItemIds]);

  return (
    <>
      <S.SelectionArea
        style={{ display: showSelectionArea ? '' : 'none' }}
        ref={squareRef}
      />
    </>
  );
};