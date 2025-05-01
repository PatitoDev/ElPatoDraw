import { create } from 'zustand';
import { AssetApi } from '../../../api/AssetApi';


export interface CacheAssetStore {
  // fileId -> assetId: objectUrl
  cache: Record<string, Record<string, string>>,
  getAssetUrl: (assetId: string, fileId: string) => Promise<string>,
  createAsset: (fileId: string, file: File) => Promise<string>,
  deleteAssets: (assetId: Array<string>, fileId: string) => Promise<void>,
  clearCache: (fileId: string) => void,
}

export const useCacheAssetStore = create<CacheAssetStore>()((set, get) => ({
  cache: {},
  clearCache: (fileId) => {
    set(prev => {
      const fileAssets = prev.cache[fileId];
      if (!fileAssets) return prev;

      for (const objUrl of Object.values(fileAssets)) {
        URL.revokeObjectURL(objUrl);
      }

      delete prev.cache[fileId];
      return prev.cache;
    });
  },
  createAsset: async (fileId, file) => {
    const assetId = await AssetApi.createAsset(fileId, file);
    const objectUrl = URL.createObjectURL(file);

    set(prev => ({
      cache: { ...prev.cache, [fileId]: {
        ...prev.cache[fileId],
        [assetId]: objectUrl
      } }
    }));
    return assetId;
  },
  getAssetUrl: async (assetId, fileId) => {
    const cacheStore = get().cache;

    if (cacheStore[fileId]){
      const cachedObjectUrl = cacheStore[fileId][assetId];
      if (cachedObjectUrl) {
        return cachedObjectUrl;
      }
    }

    const imageBlob = await AssetApi.getAsset(assetId);
    const objectUrl = URL.createObjectURL(imageBlob);

    set(prev => ({
      cache: { ...prev.cache, [fileId]: {
        ...prev.cache[fileId],
        [assetId]: objectUrl
      } }
    }));

    return objectUrl;
  },
  deleteAssets: async (assetIds, fileId) => {
    await Promise
      .all(assetIds.map(assetId => AssetApi.deleteAsset(assetId)));

    const cacheStore = get().cache;

    if (!cacheStore[fileId]) return;

    for (const assetId of assetIds) {
      const cachedObjectUrl = cacheStore[fileId][assetId];
      if (!cachedObjectUrl) return;

      URL.revokeObjectURL(cachedObjectUrl);
    }

    set(prev => {
      const fileCache = prev.cache[fileId];
      for (const assetId of assetIds) {
        delete fileCache[assetId];
      }
      return {
        cache: {
          ...prev.cache,
          [fileId]: fileCache
        }
      };
    });
  }
}));