import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Text } from '@mantine/core';
import DrawingsPage from './Pages/DrawingsPage';
import { MantineProvider } from '@mantine/core';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthenticationApi } from './api/AuthenticationApi';
import { ThemeProvider } from 'styled-components';
import { mainTheme } from './theme';
import { isProd } from './settings';

function App () {
  const session = AuthenticationApi.useSession();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <DrawingsPage />
    },
  ]);

  if (!session) {
    return (
      <MantineProvider theme={{ 
        fontFamily: 'Poppins',
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
            redirectTo={isProd ? undefined : 'http://localhost:5173'}
            providers={[ 'twitch' ]} 
            supabaseClient={AuthenticationApi.supabaseClient} 
            appearance={{ 
              theme: ThemeSupa
            }}
            theme='dark'
          >

          </Auth>
        </div>
      </MantineProvider>
    );
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <MantineProvider theme={{ 
        fontFamily: 'Poppins',
        colorScheme: 'dark',
        colors: {
        }
      }} withGlobalStyles withNormalizeCSS>
        <div style={{ height: '100vh', width: '100vw' }}>
          <RouterProvider router={router} />
        </div>
      </MantineProvider>
    </ThemeProvider>
  );
}

export default App;
