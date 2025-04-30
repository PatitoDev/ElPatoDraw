import { useEffect, useMemo } from 'react';
import { createTLStore, getSnapshot, Tldraw, TLEditorSnapshot, TLStoreOptions } from 'tldraw';
import { useDrawingStore } from '../../../Store/useDrawingStore';
import { useDebounce } from '../../../hooks/useDebounce';

import 'tldraw/tldraw.css';

export interface TlDrawEditorProps {
  id: string,
  initialData: string | null
}

export const TlDrawEditor = ({ id, initialData }: TlDrawEditorProps) => {
  const fileContent = useDrawingStore(state => state.fileContentMap[id]);
  const updateContent = useDrawingStore(state => state.updateContent);
  const save = useDrawingStore(state => state.save);

  const debouncedDrawingData = useDebounce(fileContent, 1 * 1000);

  const store = useMemo(() => {
    const snapshot = initialData ? JSON.parse(initialData) as TLEditorSnapshot : undefined;

    const options: TLStoreOptions = {
      snapshot
      /*
      assets: {
        upload: console.log,
        resolve: console.log,
      }
      */
    };

    const newStore = createTLStore(options);

    newStore.listen(() => {
      const snap = getSnapshot(newStore);
      updateContent(id, JSON.stringify(snap));
    }, {
      scope: 'document',
      source: 'user'
    });
    return newStore;
  }, [id, initialData, updateContent]);

  useEffect(() => {
    save(id);
  }, [debouncedDrawingData, save, id]);

  return (
    <Tldraw
      store={store}
      inferDarkMode
      options={{
        maxPages: 1,
      }}
    />
  );
};