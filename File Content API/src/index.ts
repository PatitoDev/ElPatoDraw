import { Env } from '../types/env';
import { authenticate } from './common/authentication';
import { createFileHandler } from './handlers/createFileHandler';
import { deleteFileHandler } from './handlers/deleteFileHandler';
import { getFileHandler } from './handlers/getFileHandler';
import { updateFileHandler } from './handlers/updateFileHandler';


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const baseHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_DOMAINS,
      "Access-Control-Allow-Methods": "GET, OPTIONS, PATCH, DELETE, POST",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === 'OPTIONS') return new Response("ok", { headers: baseHeaders });

    let response: Response | null = null;

    const userId = await authenticate(request, env);
    if (!userId) {
      return new Response('Unauthenticated', {
        status: 401,
        headers: baseHeaders
      });
    }

    try {
      switch(request.method) {
        case 'GET':
          response = await getFileHandler(request, env, userId);
          break;

        case 'PATCH':
          response = await updateFileHandler(request, env, userId);
          break;

        case 'POST':
          response = await createFileHandler(request, env, userId);
          break;

        case 'DELETE':
          response = await deleteFileHandler(request, env, userId);
          break;

        default:
          response = new Response('');
          break;
      }

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
