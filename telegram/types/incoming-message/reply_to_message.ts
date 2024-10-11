//==========================================
// Reply To Message

import { z } from 'zod';

//==========================================
export const replyToMessage_zodSchema = z.object({
  text: z.string().optional(), //Marked as optional
  caption: z.string().optional(), // Marked as optional
  chat: z.object({
    all_members_are_administrators: z.boolean(),
    id: z.number(),
    title: z.string().optional(), // Marked as optional
    type: z.string(),
  }),
  date: z.number(),
  from: z.object({
    first_name: z.string(),
    id: z.number(),
    is_bot: z.boolean(),
    language_code: z.string().optional(), // Marked as optional
    last_name: z.string().optional(), // Marked as optional
    username: z.string().optional(), // Marked as optional
  }),
  message_id: z.number(),
  photo: z
    .array(
      z.object({
        file_id: z.string(),
        file_size: z.number(),
        file_unique_id: z.string(),
        height: z.number(),
        width: z.number(),
      })
    )
    .optional(), // Marked as optional
});
