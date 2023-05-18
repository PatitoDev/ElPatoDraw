import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DrawingsPage from './Pages/DrawingsPage';
import { MantineProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { client } from './api';
import { Session } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App () {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: <DrawingsPage />
    },
  ]);

  if (!session) {
    return (
      <div style={{ height: '50vh', width: '80vw', margin: 'auto' }} >
        <Auth providers={[
          'twitch'
        ]} supabaseClient={client} appearance={{ theme: ThemeSupa }} >
          <MantineProvider theme={{ 
            fontFamily: 'Arial',
            colorScheme: 'dark',
            colors: {
            }
          }} withGlobalStyles withNormalizeCSS>
          </MantineProvider>
        </Auth>
      </div>
    );
  }

  return (
    <MantineProvider theme={{ 
      fontFamily: 'Arial',
      colorScheme: 'dark',
      colors: {
      }
    }} withGlobalStyles withNormalizeCSS>
      <div style={{ height: '100vh', width: '100vw' }}>
        <RouterProvider router={router} />
      </div>
    </MantineProvider>
  );
}

export default App;
