import { Env } from '../types/env';
import { authenticate } from './common/authentication';
import { createFileHandler } from './handlers/v1/createFileHandler';
import { deleteFileHandler } from './handlers/v1/deleteFileHandler';
import { getFileHandler } from './handlers/v1/getFileHandler';
import { updateFileHandler } from './handlers/v1/updateFileHandler';

import { createFileHandler as createFileHandlerV2 } from './handlers/v2/createFileHandler';
import { deleteFileHandler as deleteFileHandlerV2 } from './handlers/v2/deleteFileHandler';
import { getFileHandler as getFileHandlerV2 } from './handlers/v2/getFileHandler';
import { updateFileHandler as updateFileHandlerV2 } from './handlers/v2/updateFileHandler'

const handleV1Endpoints = async (request: Request, env: Env) => {
  const userId = await authenticate(request, env);
  if (!userId)
    return new Response('Unauthenticated', { status: 401 });

  switch(request.method) {
    case 'GET':
      return await getFileHandler(request, env, userId);

    case 'PATCH':
      return await updateFileHandler(request, env, userId);

    case 'POST':
      return await createFileHandler(request, env, userId);

    case 'DELETE':
      return await deleteFileHandler(request, env, userId);

    default:
      return new Response('', { status: 404 });
  }
}

const handleV2Endpoints = async (request: Request, env: Env) => {
  const token = request.headers.get('Authorization');
  if (token !== env.API_SECRET) return new Response('Unauthorized', { status: 401 });

  switch(request.method) {
    case 'GET':
      return await getFileHandlerV2(request, env);

    case 'PATCH':
      return await updateFileHandlerV2(request, env);

    case 'POST':
      return await createFileHandlerV2(request, env);

    case 'DELETE':
      return await deleteFileHandlerV2(request, env);
  }

  return new Response('', { status: 404 });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const baseHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_DOMAINS,
      "Access-Control-Allow-Methods": "GET, OPTIONS, PATCH, DELETE, POST",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === 'OPTIONS') return new Response("ok", { headers: baseHeaders });

    try {
      ;
      const isV2 = (new URL(request.url)).pathname.split('/')[1] === 'v2';

      let response: Response | null = null;
      response = await (isV2 ? handleV2Endpoints(request, env) : handleV1Endpoints(request, env));

      response.headers.set("Access-Control-Allow-Origin", baseHeaders['Access-Control-Allow-Origin']);
      response.headers.set("Access-Control-Allow-Methods", baseHeaders['Access-Control-Allow-Methods']);
      response.headers.set("Access-Control-Allow-Headers", baseHeaders['Access-Control-Allow-Headers']);
      return response;

    } catch (ex) {
      console.error(ex);
      return new Response('', { status: 500 });
    }
  },
};
