import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../settings';
import { Drawing, DrawingMetadata, NewDrawing, PatchDrawing } from '../types/Entity';

export const client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.token);
const apiURL = 'https://elpatodraw-worker.niv3k-business.workers.dev';

const getToken = async () => {
  const session = await client.auth.getSession();
  const sessionData = session.data.session;
  if (!sessionData) {
    throw new Error('not authenticated');
  }
  return sessionData.access_token;
}

const getDrawings = async () => {
  const token = await getToken();

  const resp = await fetch(apiURL, {
    headers: {
      'Authorization': token
    }
  });
  const data = await resp.json() as {
    files: Array<DrawingMetadata> 
  };
  return data.files;
};

const getDrawing = async (id: string) => {
  const token = await getToken();

  const resp = await fetch(apiURL + `/${id}`, {
    headers: {
      'Authorization': token
    }
  })
  const data = await resp.json() as Drawing;
  return data;
};

const updateDrawing = async (id:string, drawing: PatchDrawing) => {
  const token = await getToken();

  await fetch(apiURL + `/${id}`, {
    body: JSON.stringify(drawing),
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });
};

const createNewDrawing = async () => {
  const token = await getToken();
  const user = await client.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) return;

  const defaultData: NewDrawing = {
    data: {
      appState: {},
      files: [],
      elements: [],
    },
  };

  const resp = await fetch(apiURL, {
    method: 'POST',
    body: JSON.stringify(defaultData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });
  const data = await resp.json() as Drawing;
  return data;
};

const deleteDrawing = async (id: string) => {
  const token = await getToken();

  await fetch(apiURL + `/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token
    }
  });
};

export const Api = {
  deleteDrawing,
  createNewDrawing,
  getDrawings,
  getDrawing,
  updateDrawing,
};
