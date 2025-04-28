import { jwtVerify } from 'jose';
import { Env } from '../../types/env';

export const authenticate = async (request: Request, env: Env) => {
  try {
    const token = request.headers.get('Authorization');
    if (!token) {
      console.log("Missing token on request");
      return null;
    }

    const secretEncoded = new TextEncoder().encode(env.JWT_SECRET);

    const result = await jwtVerify(token, secretEncoded, {});
    const userId = result.payload.sub;
    return userId;
  } catch (er) {
    console.log(er);
    return null
  }
}