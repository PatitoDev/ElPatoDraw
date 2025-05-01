import { Env } from "../../../types/env";

export const deleteFileHandler = async (
  request: Request,
  env: Env
) => {
  const url = new URL(request.url);
  const id = url.pathname.slice(1);
  if (!id.length)
    return new Response('Invalid id', { status: 400 });

  const metadata = (await env.elpatodraw.head(id));
  if (metadata) {
    await env.elpatodraw.delete(id);
  }

  return new Response('', { status: 200 });
}