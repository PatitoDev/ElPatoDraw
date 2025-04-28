import { Env } from "../../types/env";

export const deleteFileHandler = async (
  request: Request,
  env: Env,
  userId: string
) => {
  const url = new URL(request.url);
  const id = url.pathname.slice(1);
  if (!id.length) {
    return new Response('Invalid id', { status: 400 });
  };

  const key = `${userId}_${id}`;
  const metadata = (await env.elpatodraw.head(key));
  if (!metadata) {
    return new Response('Not found', { status: 404 });
  }

  await env.elpatodraw.delete(key);
  return new Response('', { status: 200 });
}