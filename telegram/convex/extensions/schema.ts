import { telegramPayload_convexSchema } from '@/utils/telegram/convex/types';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const telegramMessageLogSchemaExtension = {
  telegram_message_logs: defineTable({
    raw: v.any(),
    formatted: telegramPayload_convexSchema,
    addInfo: v.optional(v.any()),
  })
    .index('by_chatId', ['formatted.message.chat.id'])
    .index('by_chatId_userId', [
      'formatted.message.chat.id',
      'formatted.message.from.id',
    ]),
};
