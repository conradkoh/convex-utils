import { z } from 'zod';

//========================================
// Telegram Document
//========================================
export type Document = z.infer<typeof document_zodSchema>;
export const document_zodSchema = z.object({
  file_id: z.string(),
  file_name: z.string(), //e.g: "INVOICE GROUP BOOKING ROYAL RANGERS.pdf"
  file_size: z.number(),
  file_unique_id: z.string(),
  mime_type: z.string(),
  thumb: z.object({
    file_id: z.string(),
    file_size: z.number(),
    file_unique_id: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  thumbnail: z.object({
    file_id: z.string(),
    file_size: z.number(),
    file_unique_id: z.string(),
    width: z.number(),
    height: z.number(),
  }),
});
