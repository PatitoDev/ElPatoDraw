import { Excalidraw, restoreAppState, restoreElements } from '@excalidraw/excalidraw';
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useState } from 'react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useDebouncedValue } from '@mantine/hooks';
import { Loader } from '@mantine/core';
import { Drawing } from '../../types/Entity';
import { FileContentApi } from '../../api/FileContentApi';

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
  const [debouncedValue] = useDebouncedValue(changedState, 1 * 1000);

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
      if (!drawing || !debouncedValue) return;
      console.log('update db');
      // TODO - FIX THIS HACK
      const data = JSON.parse(JSON.stringify(debouncedValue));
      FileContentApi.updateFileContent(drawing.id, {
        data,
      });
    })();
  }, [debouncedValue]);

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
        theme="dark"
        initialData={initalState}
        onChange={onDrawingChange}
      />
    </>
  );

  return (
    <Loader size="md" />
  );
};