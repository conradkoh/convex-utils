import { zodToConvex } from '@/utils/convex';
import {
  photo_zodSchema,
  replyToMessage_zodSchema,
  telegramPayload_zodSchema,
} from '@/utils/telegram/types/incoming-message';
import { z } from 'zod';

//Convex
export const telegramPayload_convexSchema = zodToConvex(
  telegramPayload_zodSchema
);

// -----------------------------
// Telegram Message
// -----------------------------

// Zod schema for TelegramMessageOutgoing
const telegramMessageOutgoing_zodSchema = z.object({
  chat_id: z.union([z.number(), z.string()]),
  message_thread_id: z.number().optional(),
  text: z.string(),
  parse_mode: z.enum(['MarkdownV2', 'HTML', 'Markdown']).optional(),
  entities: z
    .array(
      z.object({
        type: z.string(),
        offset: z.number(),
        length: z.number(),
        url: z.string().optional(),
        user: z.object({}).optional(),
        language: z.string().optional(),
        custom_emoji_id: z.string().optional(),
      })
    )
    .optional(),
  disable_web_page_preview: z.boolean().optional(),
  disable_notification: z.boolean().optional(),
  protect_content: z.boolean().optional(),
  reply_to_message_id: z.number().optional(),
  allow_sending_without_reply: z.boolean().optional(),
  reply_markup: z
    .object({
      inline_keyboard: z.array(
        z.array(
          z.object({
            text: z.string(),
            url: z.string().optional(),
            callback_data: z.string().optional(),
            web_app: z.object({ url: z.string() }).optional(),
            login_url: z
              .object({
                url: z.string(),
                forward_text: z.string().optional(),
                bot_username: z.string().optional(),
                request_write_access: z.boolean().optional(),
              })
              .optional(),
            switch_inline_query: z.string().optional(),
            switch_inline_query_current_chat: z.string().optional(),
            callback_game: z.object({}).optional(),
            pay: z.boolean().optional(),
          })
        )
      ),
    })
    .optional(),
});

// Type inference from the Zod schema
export type TelegramMessageOutgoing = z.infer<
  typeof telegramMessageOutgoing_zodSchema
>;

// Convex schema
export const telegramMessageOutgoingConvexSchema = zodToConvex(
  telegramMessageOutgoing_zodSchema
);

//========================================
// Telegram Files
//========================================
export type GetFileResponse = z.infer<typeof getFileResponse_zodSchema>;
export const getFileResponse_zodSchema = z.object({
  ok: z.boolean(),
  result: z.object({
    file_id: z.string(),
    file_unique_id: z.string(),
    file_size: z.number(),
    file_path: z.string(),
  }),
});
