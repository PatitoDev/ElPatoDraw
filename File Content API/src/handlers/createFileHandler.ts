import { v4 as uuid } from 'uuid';
import { Env } from '../../types/env';

export const createFileHandler = async (
  request: Request,
  env: Env,
  userId: string,
): Promise<Response> => {
  const id = uuid();
  const key = `${userId}_${id}`;

  if (!request.body) {
    return new Response("Missing body", { status: 400 });
  }

  await env.elpatodraw.put(key, request.body);

  return new Response(id, { status: 201 });
}