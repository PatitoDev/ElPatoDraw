export interface Drawing {
  id: string,
  created_at: string,
  data: object,
  name: string
}

export type DrawingMetadata = Pick<Drawing, 'name' | 'id' | 'created_at'>;
export type NewDrawing = Pick<Drawing, 'data'>;
export type PatchDrawing = Partial<Drawing>;