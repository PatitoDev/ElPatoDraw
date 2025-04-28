import { API_URLS } from '../settings';
import { Drawing } from '../types/Entity';
import { AuthenticationApi } from './AuthenticationApi';

const apiURL = API_URLS.worker;

const getFileContent = async (id: string) => {
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(apiURL + `/${id}`, {
    headers: {
      'Authorization': token
    }
  });
  return resp;
};

const updateFileContent = async (id:string, drawing: Drawing) => {
  const token = await AuthenticationApi.getToken();

  await fetch(apiURL + `/${id}`, {
    body: JSON.stringify(drawing),
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });
};

export const FileContentApi = {
  getFileContent,
  updateFileContent,
};
