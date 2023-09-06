import { Excalidraw, restoreAppState, restoreElements } from '@excalidraw/excalidraw';
import { AppState, BinaryFiles, ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';
import { useCallback, useEffect, useState } from 'react';
import { Api } from '../../api';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { Button, Flex, Modal, TextInput } from '@mantine/core';
import { Drawing } from '../../types/Entity';

export interface DrawingViewProps {
  drawing: Drawing,
  onDelete: (id: string) => void,
  onChange: (drawing: DrawingViewProps['drawing']) => void,
}

interface ExcalidrawDataState {
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}

export const DrawingView = ({ drawing, onChange, onDelete }: DrawingViewProps) => {
  const [drawingName, setDrawingName] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);
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
    setDrawingName(drawing.name);
  }, [drawing]);

  useEffect(() => {
    (async () => {
      if (!drawing || !debouncedValue) return;
      console.log('update db');
      // TODO - FIX THIS HACK
      const data = JSON.parse(JSON.stringify(debouncedValue));
      onChange({...drawing, data});
      Api.updateDrawing(drawing.id, {
        data,
      });
    })();
  }, [debouncedValue]);

  const onDrawingChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
    if (opened) return;
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
  }, [opened]);

  const renderTopRightUI = useCallback(() => {
    return (
      <Button onClick={open}>
          Edit
      </Button>
    );
  }, []);

  const onDrawingClientWhichHasBeenSelectedNameHasChangeAndTheUserHasClickedTheSaveButtonCallbackXD = useCallback(async () => {
    if (!drawing) return;
    await Api.updateDrawing(drawing.id, { name: drawingName });
    onChange({ ...drawing, name: drawingName });
    close();
  }, [drawingName]);

  const onDrawingDeleteClick = useCallback(async () => {
    if (!drawing) return;
    await Api.deleteDrawing(drawing.id);
    onDelete(drawing.id);
  }, []);

  const onFileNameInputChange = useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setDrawingName(e.target.value);
  }, []);

  if (initalState) return (
    <>
      {drawing && (
        <Modal opened={opened} onClose={close} title="Edit" centered>
          <TextInput label="Name" mb="2em" value={drawingName} onChange={onFileNameInputChange} />
          <Flex justify="space-between" direction="row">
            <Button color="red" onClick={() => onDrawingDeleteClick()}>Delete</Button>
            <Flex direction="row" gap={10}>
              <Button onClick={onDrawingClientWhichHasBeenSelectedNameHasChangeAndTheUserHasClickedTheSaveButtonCallbackXD}>Save</Button>
              <Button variant='outline' onClick={close}>Cancel</Button>
            </Flex>
          </Flex>
        </Modal>
      )}
      <Excalidraw
        theme="dark"
        initialData={initalState}
        onChange={onDrawingChange}
        renderTopRightUI={renderTopRightUI}
      />
    </>
  );

  return (
    <div>loading...</div>
  );
};