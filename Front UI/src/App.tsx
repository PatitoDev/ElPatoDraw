import DrawingsPage from './Pages/DrawingsPage';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AuthenticationApi } from './api/AuthenticationApi';
import { ThemeProvider } from 'styled-components';
import { mainTheme } from './theme';
import { isProd } from './settings';

function App() {
  const session = AuthenticationApi.useSession();

  if (!session) {
    return (
      <ThemeProvider theme={mainTheme} >
        <h1 style={{ fontSize: '3em', fontWeight: 'bold', textAlign: 'center', margin: '1em' }}>
          El Pato Draw
        </h1>
        <div style={{
          height: '50vh',
          maxWidth: '30em',
          width: '100%',
          margin: 'auto'
        }} >
          <Auth
            redirectTo={isProd ? undefined : 'http://localhost:5173'}
            providers={['twitch']}
            supabaseClient={AuthenticationApi.supabaseClient}
            appearance={{
              theme: ThemeSupa
            }}
            theme='dark'
          >
          </Auth>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <div style={{ height: '100vh', width: '100vw' }}>
        <DrawingsPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
