import { telegramPayloadZodSchema } from '@/utils/telegram/convex/types';
import { zodToConvex } from 'convex-helpers/server/zod';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const telegramMessageLogSchemaExtension = {
  telegram_message_logs: defineTable({
    raw: v.any(),
    formatted: zodToConvex(telegramPayloadZodSchema),
    addInfo: v.optional(v.any()),
  })
    .index('by_chatId', ['formatted.message.chat.id'])
    .index('by_chatId_userId', [
      'formatted.message.chat.id',
      'formatted.message.from.id',
    ]),
};
