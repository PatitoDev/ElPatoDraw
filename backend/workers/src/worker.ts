import { jwtVerify } from 'jose';
import { SECRETS } from '../secrets';
import { v4 as uuid } from 'uuid';
import { Drawing, DrawingMetadata, NewDrawing, PatchDrawing } from '../types/entities';

export interface Env {
	elpatodraw: R2Bucket;
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS, PATCH, DELETE, POST",
	"Access-Control-Allow-Headers": "*",
};

const authenticate = async (request: Request) => {
	try {
		const token = request.headers.get('Authorization');
		if (!token) {
			throw new Error('Unauthenticated');
		}

		const secretEncoded = new TextEncoder().encode(SECRETS.jwtSecret);

		const result = await jwtVerify(token, secretEncoded, {
		});
		const userId = result.payload.sub;
		return userId;
	} catch (er) {
		console.log(er);
		return null
	}
}

const handlePost = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
	try {
		const userId = await authenticate(request);
		if (!userId) {
			return new Response('Unauthenticated', { status: 401, headers: corsHeaders });
		}

		const id = uuid();
		const key = `${userId}_${id}`;

		const { data } = await request.json() as NewDrawing;
		const createdAt = new Date().toDateString();
		const name = `Draft - ${createdAt}`;
		const newDrawing: Drawing = {
			id,
			created_at: createdAt,
			name,
			data,
		}

		await env.elpatodraw.put(key, JSON.stringify(newDrawing), {
			customMetadata: {
				name
			}
		});

		return new Response(JSON.stringify(newDrawing), { 
			status: 201,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	} catch {
		return new Response('', {
			status: 500,
			headers: corsHeaders
		});
	}
}

const handlePatch = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
	try {
		const url = new URL(request.url);
		const id = url.pathname.slice(1);
		if (!id.length) {
			return new Response('Invalid id', { status: 400, headers: corsHeaders });
		};

		const userId = await authenticate(request);
		if (!userId) {
			return new Response('Unauthenticated', { status: 401, headers: corsHeaders });
		}

		const key = `${userId}_${id}`; 
		const metadata = (await env.elpatodraw.head(key));
		if (!metadata) {
			return new Response('Not found', { status: 404, headers: corsHeaders });
		}

		const dataToPatch = await request.json() as PatchDrawing;
		const existingData = await (await env.elpatodraw.get(key))?.json() as Drawing;
		if (dataToPatch.name) {
			existingData.name = dataToPatch.name
		}

		if (dataToPatch.data) {
			existingData.data = dataToPatch.data;
		}

		await env.elpatodraw.put(key, JSON.stringify(existingData), {
			customMetadata: {
				name: existingData.name
			}
		});
		return new Response(JSON.stringify(existingData), { headers: {
				'Content-Type': 'application/json',
			...corsHeaders,
		} });
	} catch {
		return new Response('', {
			status: 500,
			headers: corsHeaders
		});
	}
}

const handleGet = async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
	try {
		const userId = await authenticate(request);
		if (!userId) {
			return new Response('Unauthenticated', { status: 401, headers: corsHeaders });
		}

		const paths = request.url.split('/');
		const id = paths[paths.length - 1];

		// if there is no id list all files
		if (!id) {
			const files = await env.elpatodraw.list({
				prefix: userId,
				include: ['customMetadata', 'httpMetadata'],
			} as R2ListOptions);

			const filesMapped: Array<DrawingMetadata> = files.objects
				.map((file) => ({
					name: file.customMetadata?.name ?? 'No name',
					id: file.key.split('_')[1],
					created_at: file.uploaded.toDateString()
				}));

			return new Response(JSON.stringify({
				files: filesMapped
			}), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			})
		}

		const key = `${userId}_${id}`;

		const object = await env.elpatodraw.get(key);
		if (!object) {
			return new Response('Not found', { status: 404, headers: corsHeaders });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return new Response(object.body, {
			headers: {
				...headers,
				...corsHeaders
			},
		}); 
	} catch {
		return new Response('Woops', { status: 500, headers: corsHeaders });
	}
};

const handleDelete = async (request: Request, env: Env, ctx: ExecutionContext) => {
		const userId = await authenticate(request);
		if (!userId) {
			return new Response('Unauthenticated', { status: 401, headers: corsHeaders });
		}

		const url = new URL(request.url);
		const id = url.pathname.slice(1);
		if (!id.length) {
			return new Response('Invalid id', { status: 400, headers: corsHeaders });
		};

		const key = `${userId}_${id}`; 
		const metadata = (await env.elpatodraw.head(key));
		if (!metadata) {
			return new Response('Not found', { status: 404, headers: corsHeaders });
		}

		await env.elpatodraw.delete(key);
		return new Response('', { status: 200, headers: corsHeaders });
}


const handleOptions = async (request: Request, env: Env, ctx: ExecutionContext) => {
	return new Response("ok", {
		headers: corsHeaders,
	});
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		switch(request.method) {
			case 'GET':
				return await handleGet(request, env, ctx);
			case 'PATCH':
				return await handlePatch(request, env, ctx);
			case 'POST':
				return await handlePost(request, env, ctx);
			case 'DELETE':
				return await handleDelete(request, env, ctx);
			case 'OPTIONS':
				return await handleOptions(request, env, ctx);
		}

		return new Response('', { headers: corsHeaders });
	},
};
