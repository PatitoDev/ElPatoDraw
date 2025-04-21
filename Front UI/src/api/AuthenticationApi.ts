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
  const [session, setSession] = useState<{
    isLoading: boolean,
    session: Session | null
  }>({ isLoading: true, session: null });

  useEffect(() => {
    const authStateChangeSubscription = client
      .auth
      .onAuthStateChange((_event, session) => {
        setSession({ isLoading: false, session });
      });

    return () => authStateChangeSubscription.data.subscription.unsubscribe();
  }, []);

  return session;
};

export const AuthenticationApi = {
  getToken,
  getUser,
  useSession,
  supabaseClient: client
};
