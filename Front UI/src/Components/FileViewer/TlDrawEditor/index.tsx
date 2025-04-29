import { useEffect, useState } from 'react';
import { createTLStore, getSnapshot, loadSnapshot, Tldraw } from 'tldraw';
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

  const [store] = useState(() => createTLStore());


  useEffect(() => {
    console.log(initialData);
    if (initialData) {
      console.log('loading initial data');
      const snapshot = JSON.parse(initialData);
      loadSnapshot(store, snapshot);
    }

    store.listen(() => {
      const snap = getSnapshot(store);
      console.log('changes ready');
      updateContent(id, JSON.stringify(snap));
    }, {
      scope: 'document',
      source: 'user'
    });
  }, [id, initialData, updateContent, store]);


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