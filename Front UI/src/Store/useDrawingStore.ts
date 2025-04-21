import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState, BinaryFiles } from '@excalidraw/excalidraw/types/types';
import { create } from 'zustand';
import { FileContentApi } from '../api/FileContentApi';

export interface DrawingState {
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  files: BinaryFiles
}

export interface DrawingStore {
  drawingData: Record<string, DrawingState>,
  updateState: (id: string, state: DrawingState) => void,
  save: (id: string) => Promise<void>,
  closeAndSave: (id: string) => Promise<void>,
}

export const useDrawingStore = create<DrawingStore>()((set, get) => ({
  drawingData: {},
  updateState: (id, state) => {
    set(prev => (
      { drawingData: { ...prev.drawingData, [id]: state } }
    ));
  },
  closeAndSave: async (id) => {
    await get().save(id);
    set(prev => {
      delete prev.drawingData[id];
      return { drawingData: prev.drawingData };
    });
  },
  save: async (id) => {
    const drawing = get().drawingData[id];
    if (!drawing) return;

    const data = JSON.parse(JSON.stringify(drawing));

    await FileContentApi.updateFileContent(id, {
      data,
    });
    console.log('File saved ', id);
  },
}));

