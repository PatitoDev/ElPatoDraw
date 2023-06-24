import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Text } from '@mantine/core';
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
      <MantineProvider theme={{ 
        fontFamily: 'Arial',
        colorScheme: 'dark',
      }} withGlobalStyles withNormalizeCSS>
        <Text size="3em" weight="bold" align="center" m="1em">
          El Pato Draw
        </Text>
        <div style={{ 
            height: '50vh',
            maxWidth: '30em',
            width: '100%',
            margin: 'auto' 
          }} >
          <Auth 
            providers={[ 'twitch' ]} 
            supabaseClient={client} 
            appearance={{ 
              theme: ThemeSupa,
            }}
            theme='dark'
          >

          </Auth>
        </div>
      </MantineProvider>
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
