import { API_URLS } from '../settings';
import { AuthenticationApi } from './AuthenticationApi';

const baseUrl = API_URLS.metadataApi;

const createAsset = async (parentFileId: string, file:File) => {
  const token = await AuthenticationApi.getToken();
  const apiURL = `${baseUrl}/asset?parentFileId=${parentFileId}`;

  const data = new FormData();
  data.append('file', file);
  const resp = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Authorization': token
    },
    body: data
  });

  return (await resp.json()) as string;
};

const getAsset = async (assetId: string) => {
  const token = await AuthenticationApi.getToken();
  const apiURL = `${baseUrl}/asset/${assetId}`;

  const resp = await fetch(apiURL, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  });

  return await resp.blob();
};

const deleteAsset = async (assetId: string) => {
  const token = await AuthenticationApi.getToken();
  const apiURL = `${baseUrl}/asset/${assetId}`;

  return await fetch(apiURL, {
    method: 'DELETE',
    headers: {
      'Authorization': token
    }
  });
};

const getAssetUrl = (assetId: string) => {
  return `${baseUrl}/asset/${assetId}`;
};

export const AssetApi = {
  createAsset,
  getAsset,
  deleteAsset,
  getAssetUrl
};