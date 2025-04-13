export const isProd = process.env.NODE_ENV === 'production';

export const SUPABASE_CONFIG = {
  url: 'https://qvvzhuuxhdxpkbeaasqp.supabase.co',
  // This is a public token so if you are trying to steal my tokens don't bother with this one
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dnpodXV4aGR4cGtiZWFhc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQyNTg2MTgsImV4cCI6MTk5OTgzNDYxOH0.Wx5fbJtRDFTizlNBgn4VvgJVK6L0OZ2KhHWRGORXaZ0',
};

export const API_URLS = {
  worker: isProd ? 'https://fileworker.elpato.dev' : 'https://fileworker-dev.elpato.dev',
  metadataApi: isProd ? 'https://api.elpato.dev/PatoDrawApi' : 'http://localhost:9356'
}