import { z } from 'zod';

//========================================
// Telegram Photo
//========================================
export type Photo = z.infer<typeof photo_zodSchema>;
export const photo_zodSchema = z.object({
  file_id: z.string(),
  file_unique_id: z.string(),
  width: z.number(),
  height: z.number(),
  file_size: z.number(),
});
