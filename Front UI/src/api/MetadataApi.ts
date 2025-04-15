import { API_URLS } from '../settings';
import { File, FileType, Folder } from '../types/File';
import { AuthenticationApi } from './AuthenticationApi';

const baseUrl = API_URLS.metadataApi;

const getFile = async (fileId: string): Promise<File | null> => {
  const url = `${baseUrl}/file/${fileId}`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  });

  if (!resp.ok) return null;
  return await resp.json();
};

const createFile = async (fileName: string, fileType: FileType, parentFolderId?: string): Promise<string | null> => {
  const url = `${baseUrl}/file`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      name: fileName,
      type: fileType,
      parentFolderId
    })
  });

  if (!resp.ok) return null;
  return await resp.json();
};

export interface FileUpdateDetails {
  id: string,
  name: string,
  color?: string,
  parentFolderId?: string
}

const updateFiles = async (files: Array<FileUpdateDetails>) => {
  const url = `${baseUrl}/file`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(files)
  });

  if (!resp.ok) return null;
  return await resp.json();
};

export interface FolderUpdateDetails {
  id: string,
  color?: string,
  name: string,
  parentFolderId?: string
}

const updateFolders = async (files: Array<FolderUpdateDetails>) => {
  const url = `${baseUrl}/folder/update`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(files)
  });

  if (!resp.ok) return null;
  return await resp.json();
};

const deleteFiles = async (fileIds: Array<string>) => {
  const url = `${baseUrl}/file/`;
  const token = await AuthenticationApi.getToken();

  await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    body: JSON.stringify(fileIds)
  });
};

const deleteFolders = async (folderIds: Array<string>) => {
  const url = `${baseUrl}/folder/`;
  const token = await AuthenticationApi.getToken();

  await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'DELETE',
    body: JSON.stringify(folderIds)
  });
};

const createFolder = async (folderName: string, parentFolderId?: string): Promise<string | null> => {
  const url = `${baseUrl}/folder`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      name: folderName,
      parentFolderId
    })
  });

  if (!resp.ok) return null;
  return await resp.json();
};

const getFolder = async (folderId?: string | null): Promise<Folder | null> => {
  const url = `${baseUrl}/folder/${folderId ?? ''}`;
  const token = await AuthenticationApi.getToken();

  const resp = await fetch(url, {
    headers: {
      'Authorization': token
    }
  });

  if (resp.ok) {
    return await resp.json();
  }

  return null;
};

export const MetadataApi = {
  getFolder,
  createFile,
  deleteFiles,
  deleteFolders,
  createFolder,
  updateFiles,
  updateFolders,
  getFile
};