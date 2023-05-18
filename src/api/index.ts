import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/db';

export const client = createClient<Database>('https://qvvzhuuxhdxpkbeaasqp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dnpodXV4aGR4cGtiZWFhc3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQyNTg2MTgsImV4cCI6MTk5OTgzNDYxOH0.Wx5fbJtRDFTizlNBgn4VvgJVK6L0OZ2KhHWRGORXaZ0');

const getDrawings = async () => {
  const { data } = await client.from('Drawing').select();
  return data ?? [];
};

const getDrawing = async (id: number) => {
  const { data } = await client.from('Drawing')
    .select()
    .eq('id', id)
    .single();

  return data;
};

const updateDrawing = async (id:number, drawing: Database['public']['Tables']['Drawing']['Update']) => {
  await client.from('Drawing')
    .update(drawing)
    .eq('id', id);
};

const createNewDrawing = async () => {
  const user = await client.auth.getUser();
  const userId = user.data.user?.id;
  if (!userId) return;

  const defaultData: Database['public']['Tables']['Drawing']['Insert'] = {
    name: `Draft - ${new Date().toDateString()}`,
    data: {
      appState: {},
      files: [],
      elements: [],
    },
    userId
  };

  const { data } = await client.from('Drawing')
    .insert(defaultData)
    .select()
    .single();
  return data;
};

const addDrawing = async (drawing: Database['public']['Tables']['Drawing']['Insert']) => {
  const { data } = await client.from('Drawing')
    .insert(drawing)
    .select()
    .single();
  return data;
};

const deleteDrawing = async (id: number) => {
  await client.from('Drawing').delete().eq('id', id);
};

export const Api = {
  deleteDrawing,
  createNewDrawing,
  getDrawings,
  getDrawing,
  updateDrawing,
  addDrawing
};
