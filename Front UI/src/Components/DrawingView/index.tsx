/* eslint-disable @typescript-eslint/no-explicit-any */
import { Excalidraw, restoreAppState, restoreElements } from '@excalidraw/excalidraw';
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useState } from 'react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Drawing } from '../../types/Entity';
import { useDebounce } from '../../hooks/useDebounce';
import { useDrawingStore } from '../../Store/useDrawingStore';

export interface DrawingViewProps {
  id: string,
  drawing: Drawing,
}

export const DrawingView = ({ id, drawing }: DrawingViewProps) => {
  const drawingData = useDrawingStore(store => store.drawingData[id]);
  const save = useDrawingStore(store => store.save);
  const updateState = useDrawingStore(store => store.updateState);

  const [initalState, setInitalState] = useState<ExcalidrawInitialDataState | null>(null);
  const debouncedValue = useDebounce(drawingData, 1 * 1000);

  useEffect(() => {
    const data = drawing.data as { appState: unknown, files: Array<unknown>, elements: Array<unknown>};
    const elements = restoreElements(data.elements as any, null);
    const appState = restoreAppState(data.appState as any, null);
    // TODO - move files to blob storage
    setInitalState({
      elements,
      files: data.files as any,
      appState
    });
  }, [drawing]);

  useEffect(() => {
    (async () => {
      if (!debouncedValue) return;
      await save(id);
    })();
  }, [debouncedValue, drawing, id, save]);

  const onDrawingChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    const appStateModified = {
      ...appState,
      collaborators: []
    };
    updateState(id, {
      elements,
      appState: appStateModified as any,
      files
    });
  }, [updateState, id]);

  if (initalState) return (
    <Excalidraw
      theme='dark'
      initialData={initalState}
      onChange={onDrawingChange}
    />
  );

  return (
    <div>Loading...</div>
  );
};