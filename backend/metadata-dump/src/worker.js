/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
  async fetch(request, env, ctx) {
    const token = request.headers.get('Authorization');
    if (token !== env.secretKey){
      return new Response('Unauthorized', { status: 401 });
    }

    const resp = await env.ElPatoDrawBucket.list({
      include: ['customMetadata']
    })

    const items = resp.objects.map(file => ({
      userId: file.key.split('_')[0],
      id: file.key.split('_')[1],
      key: file.key,
      name: file.customMetadata?.name ?? 'No name',
      createdAt: file.uploaded,
      size: file.size
    }));

    let cursor = resp.cursor;

    while (cursor){
      const next = await env.ElPatoDrawBucket.list({
        include: ['customMetadata'],
        cursor: cursor
      });
      items.push(
        ...next.objects.map(file => ({
          userId: file.key.split('_')[0],
          id: file.key.split('_')[1],
          key: file.key,
          name: file.customMetadata?.name ?? 'No name',
          createdAt: file.uploaded,
          size: file.size
        }))
      );
      cursor = next.cursor;
    }


    return new Response(JSON.stringify(items), { headers : {
      'Content-Type': 'application/json'
    }});
  },
};