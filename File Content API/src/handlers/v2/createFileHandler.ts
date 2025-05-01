import { v4 as uuid } from 'uuid';
import { Env } from '../../../types/env';

export const createFileHandler = async (
  request: Request,
  env: Env
): Promise<Response> => {
  const id = uuid();

  if (!request.body)
    return new Response("Missing body", { status: 400 });

  await env.elpatodraw.put(id, request.body);

  return new Response(id, { status: 201 });
}