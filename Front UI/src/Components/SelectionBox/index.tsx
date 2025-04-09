import { useEffect, useRef } from 'react';
import * as S from './styles';
import { useFileStorageStore } from '../../Store/FileStorageStore';
import { Box, Point, utils } from './utils';


export const SelectionBox = () => {
  const draggedItemsSquareRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const clearSelection = useFileStorageStore(state => state.clearSelection);
  const isOnHomeTab = useFileStorageStore(state => state.fileIdCurrentlyEditing === null);
  const itemContainerRef = useFileStorageStore(state => state.itemContainerRef);
  const setSelectedItemIds = useFileStorageStore(state => state.setSelectedItemsIds);
  const getSelectedItems = useFileStorageStore(state => state.getSelectedItems);
  const setIsMovingItesm = useFileStorageStore(state => state.setIsMovingItems)

  useEffect(() => {
    // selection box logic
    let startPosition: Point | null = null;
    let endPosition: Point | null = null;
    let selectedItemsCached: Array<string> = [];

    let hasClickedOnFile: boolean = false;

    const onDocumentMouseDown = (e: MouseEvent) => {
      if (!isOnHomeTab) return;
      hasClickedOnFile = !!utils.getFileUnderMouse(itemContainerRef, e);
      startPosition = { x: e.clientX, y: e.clientY };
      const selectedItems = getSelectedItems();
      selectedItemsCached = [
        ...selectedItems.files.map(f => f.id),
        ...selectedItems.folders.map(f => f.id)
      ];
    };

    const onDocumentMouseUp = (e: MouseEvent) => {
      setIsMovingItesm(hasClickedOnFile);
      if (!e.ctrlKey && endPosition === null && !hasClickedOnFile) {
        clearSelection();
      }

      startPosition = null;
      endPosition = null;
      if (!isOnHomeTab) return;
      if (!squareRef.current) return;
      squareRef.current.style.display = 'none';
      if (!draggedItemsSquareRef.current) return;
      draggedItemsSquareRef.current.style.display = 'none';
    };

    const onDocumentMouseMove = (e: MouseEvent) => {
      if (!isOnHomeTab) return;
      if (!squareRef.current) return;
      if (startPosition === null) return;
      if (!squareRef.current) return;

      if (hasClickedOnFile && draggedItemsSquareRef.current) {
        draggedItemsSquareRef.current.style.display = '';
        draggedItemsSquareRef.current.dataset.left = e.clientX.toString();
        draggedItemsSquareRef.current.dataset.top = e.clientY.toString();
        return;
      }

      squareRef.current.style.display = '';

      endPosition = { x: e.clientX, y: e.clientY };

      const width = Math.abs(endPosition.x - startPosition.x);
      const height = Math.abs(endPosition.y - startPosition.y);
      const x = Math.min(startPosition.x, endPosition.x);
      const y = Math.min(startPosition.y, endPosition.y);

      squareRef.current.dataset.left = x.toString();
      squareRef.current.dataset.top = y.toString();
      squareRef.current.dataset.width = width.toString();
      squareRef.current.dataset.height = height.toString();

      const selectedFileIds = utils.getFileIdsInsideBox(x, y, width, height, itemContainerRef);

      if (!e.ctrlKey) {
        setSelectedItemIds(selectedFileIds);
        return;
      }

      let finalSelection = [...selectedItemsCached];
      selectedFileIds.forEach((selectedId) => {
        if (finalSelection.includes(selectedId)) {
          finalSelection = finalSelection.filter(id => id !== selectedId);
          return;
        }
        finalSelection = [...finalSelection, selectedId];
      })

      setSelectedItemIds(finalSelection);
    };

    document.addEventListener('mousedown', onDocumentMouseDown);
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    }
  }, [clearSelection, isOnHomeTab, itemContainerRef])

  return (
    <S.Container>
      <S.SelectionArea style={{ display: 'none' }} ref={squareRef} />
      <S.DraggedItems style={{ display: 'none' }} ref={draggedItemsSquareRef} />
    </S.Container>
  )
}