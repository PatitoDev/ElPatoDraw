import { Env } from "../../../types/env";

export const getFileHandler = async (
  request: Request,
  env: Env,
  userId: string,
): Promise<Response> => {

  const paths = request.url.split('/');
  const id = paths[paths.length - 1];

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const key = `${userId}_${id}`;

  const object = await env.elpatodraw.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers: {
      ...headers,
    },
  });
};

