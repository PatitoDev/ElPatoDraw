import { useEffect, useMemo, useState } from 'react';
import { createTLStore, Editor, getSnapshot, Tldraw, TLEditorSnapshot, TLStoreOptions } from 'tldraw';
import { useDrawingStore } from '../../../Store/useDrawingStore';
import { useDebounce } from '../../../hooks/useDebounce';
import { AssetApi } from '../../../api/AssetApi';
import { useCacheAssetStore } from './useCacheAssetStore';
import { useFileStorageStore } from '../../../Store/FileStorageStore';

import 'tldraw/tldraw.css';

export interface TlDrawEditorProps {
  id: string,
  initialData: string | null
}

export const TlDrawEditor = ({ id, initialData }: TlDrawEditorProps) => {
  const clearCache = useCacheAssetStore(cache => cache.clearCache);
  const createAsset = useCacheAssetStore(cache => cache.createAsset);
  const deleteAssets = useCacheAssetStore(cache => cache.deleteAssets);
  const getAssetUrl = useCacheAssetStore(cache => cache.getAssetUrl);

  const fileContent = useDrawingStore(state => state.fileContentMap[id]);
  const updateContent = useDrawingStore(state => state.updateContent);
  const save = useDrawingStore(state => state.save);

  const isFocused = useFileStorageStore(state => state.fileIdCurrentlyEditing === id);

  const debouncedDrawingData = useDebounce(fileContent, 1 * 1000);
  const [editor, setEditor] = useState<Editor | null>(null);

  const store = useMemo(() => {
    const snapshot = initialData ? JSON.parse(initialData) as TLEditorSnapshot : undefined;

    const options: TLStoreOptions = {
      snapshot,
      assets: {
        upload: async (_, file) => {
          const assetId = await createAsset(id, file);
          return {
            src: AssetApi.getAssetUrl(assetId),
            meta: {
              assetId
            }
          };
        },
        resolve: async (asset) => {
          const assetId = asset.meta['assetId'];
          if (typeof assetId === 'string') {
            return await getAssetUrl(assetId, id);
          }
          return asset.props.src;
        },
        remove: async (assetIds) => {
          console.log('Asset store released: ', assetIds);
          deleteAssets(assetIds, id);
        }
      }
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
  }, [id, initialData, updateContent, getAssetUrl, createAsset, deleteAssets]);

  useEffect(() => {
    save(id);
  }, [debouncedDrawingData, save, id]);

  useEffect(() => {
    return () => {
      // clear cache on unmount
      clearCache(id);
    };
  }, [clearCache, id]);

  useEffect(() => {
    if (!editor) return;
    isFocused ? editor.focus() : editor.blur();
  }, [isFocused, editor]);

  return (
    <Tldraw
      autoFocus={false}
      store={store}
      inferDarkMode
      options={{
        maxPages: 1,
      }}
      onMount={(e) => { setEditor(e); }}
    />
  );
};