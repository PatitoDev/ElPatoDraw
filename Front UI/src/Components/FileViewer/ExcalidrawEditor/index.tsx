/* eslint-disable @typescript-eslint/no-explicit-any */
import { Excalidraw, restoreAppState, restoreElements } from '@excalidraw/excalidraw';
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useState } from 'react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

import { useDebounce } from '@Hooks/useDebounce';
import { useFileContentStore } from '@Store/useFileContentStore';


export interface DrawingFile {
  data: object,
}

export interface ExcalidrawEditorProps {
  id: string,
  initialData: string | null,
}

export const ExcalidrawEditor = ({ id, initialData }: ExcalidrawEditorProps) => {
  const fileContent = useFileContentStore(store => store.fileContentMap[id]);
  const save = useFileContentStore(store => store.save);
  const updateContent = useFileContentStore(store => store.updateContent);

  const debouncedValue = useDebounce(fileContent, 1 * 1000);

  const [initalState] = useState<ExcalidrawInitialDataState | null>(() => {
    if (!initialData) return null;
    const drawing = JSON.parse(initialData) as DrawingFile;
    const data = drawing.data as { appState: unknown, files: Array<unknown>, elements: Array<unknown>};
    const elements = restoreElements(data.elements as any, null);
    const appState = restoreAppState(data.appState as any, null);
    // TODO - move files to blob storage
    return {
      elements,
      files: data.files as any,
      appState
    };
  });

  useEffect(() => {
    (async () => {
      if (!debouncedValue) return;
      await save(id);
    })();
  }, [debouncedValue, id, save]);

  const onDrawingChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    const appStateModified = {
      ...appState,
      collaborators: []
    };

    const newContent: DrawingFile = {
      data: {
        elements,
        appState: appStateModified as any,
        files
      }
    };

    updateContent(id, JSON.stringify(newContent));
  }, [updateContent, id]);

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