import { Env } from "../../../types/env";

export const updateFileHandler = async (
  request: Request,
  env: Env,
  userId: string,
): Promise<Response> => {

  const url = new URL(request.url);
  const id = url.pathname.slice(1);
  if (!id.length) {
    return new Response('Invalid id', { status: 400 });
  };

  const key = `${userId}_${id}`;

  const file = await env.elpatodraw.get(key);
  if (!file) {
    return new Response('Not found', { status: 404 });
  }

  if (!request.body){
    return new Response('Missing Body', { status: 400 });
  }

  await env.elpatodraw.put(key, request.body);

  return new Response(null, { status: 200 });
}