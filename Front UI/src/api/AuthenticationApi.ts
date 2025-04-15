import { createClient, Session } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../settings';
import { useEffect, useState } from 'react';

const client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.token);

const getToken = async () => {
  const session = await client.auth.getSession();
  const sessionData = session.data.session;
  if (!sessionData) {
    throw new Error('not authenticated');
  }
  return sessionData.access_token;
};

const getUser = async () => {
  return client.auth.getUser();
};

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      return;
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
};

export const AuthenticationApi = {
  getToken,
  getUser,
  useSession,
  supabaseClient: client
};
