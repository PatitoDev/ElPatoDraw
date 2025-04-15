/* eslint-disable @typescript-eslint/no-explicit-any */
import { Excalidraw, restoreAppState, restoreElements } from '@excalidraw/excalidraw';
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useState } from 'react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { Drawing } from '../../types/Entity';
import { FileContentApi } from '../../api/FileContentApi';
import { useDebounce } from '../../hooks/useDebounce';

export interface DrawingViewProps {
  drawing: Drawing,
}

interface ExcalidrawDataState {
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}

export const DrawingView = ({ drawing }: DrawingViewProps) => {
  const [initalState, setInitalState] = useState<ExcalidrawInitialDataState | null>(null);
  const [changedState, setChangedState] = useState<ExcalidrawDataState | null>(null);
  const debouncedValue = useDebounce(changedState, 1 * 1000);
  const id = drawing.id;

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
      console.log('update db');
      // TODO - FIX THIS HACK
      const data = JSON.parse(JSON.stringify(debouncedValue));
      FileContentApi.updateFileContent(id, {
        data,
      });
    })();
  }, [debouncedValue, id]);

  const onDrawingChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    console.log('changed state');
    const appStateModified = {
      ...appState,
      collaborators: []
    };
    setChangedState({
      elements,
      appState: appStateModified as any,
      files
    });
  }, []);

  if (initalState) return (
    <>
      <Excalidraw
        theme='dark'
        initialData={initalState}
        onChange={onDrawingChange}
      />
    </>
  );

  return (
    <div>Loading...</div>
  );
};