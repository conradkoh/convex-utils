import { photo_zodSchema } from '@/utils/telegram/types/incoming-message/photo';
import { replyToMessage_zodSchema } from '@/utils/telegram/types/incoming-message/reply_to_message';
import { z } from 'zod';
export type TelegramWebhookPayload = z.infer<typeof telegramPayload_zodSchema>;
export function parseTelegramPayload(payload: any): TelegramWebhookPayload {
  return telegramPayload_zodSchema.parse(payload);
}
export const telegramPayload_zodSchema = z.object({
  update_id: z.number(),
  message: z
    .object({
      message_id: z.number(),
      from: z.object({
        id: z.number(),
        is_bot: z.boolean(),
        first_name: z.string(),
        last_name: z.string().optional(), // Optional
        username: z.string().optional(), // Optional
        language_code: z.string().optional(), // Optional
      }),
      chat: z.object({
        id: z.number(),
        first_name: z.string().optional(), // Optional
        last_name: z.string().optional(), // Optional
        username: z.string().optional(), // Optional
        type: z.string(),
      }),
      date: z.number(),
      text: z.string().optional(), // Optional
      caption: z.string().optional(), // Optional
      entities: z
        .array(
          z.object({
            offset: z.number(),
            length: z.number(),
            type: z.string(),
          })
        )
        .optional(), // Optional
      photo: z.array(photo_zodSchema).optional(),

      // Reply to message
      reply_to_message: replyToMessage_zodSchema.optional(),
    })
    .optional(), // Optional because other types of updates can exist
});

export * from './photo';
export * from './reply_to_message';
