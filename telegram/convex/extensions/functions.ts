import { TelegramMessageBuilder } from '@/utils/telegram';
import {
  telegramMessageOutgoingConvexSchema,
  telegramPayloadConvexSchema,
  WebhookPayload,
} from '@/utils/telegram/convex';
import { internal } from 'convex/_generated/api';
import {
  type ActionCtx,
  internalAction,
  internalMutation,
} from 'convex/_generated/server';
import { v } from 'convex/values';
import { z } from 'zod';

/**
 * Register webhook with telegram by running _registerWebhook from the convex console
 */
export const _registerWebhook = internalAction({
  args: {},
  handler: async () => {
    const url = `${process.env.CONVEX_SITE_URL}/onMessage?token=${process.env.TELEGRAM_WEBHOOK_SECRET}`;
    const response = await fetch(
      'https://api.telegram.org/bot' +
        process.env.TELEGRAM_BOT_TOKEN +
        '/setWebhook',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }),
      }
    );
    if (response.status !== 200) {
      throw new Error('Failed to register webhook');
    }
  },
});

/**
 * Send message to telegram.
 */
export const _sendMessage = internalAction({
  args: telegramMessageOutgoingConvexSchema,
  handler: async (ctx, args) => {
    const response = await fetch(
      'https://api.telegram.org/bot' +
        process.env.TELEGRAM_BOT_TOKEN +
        '/sendMessage',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      }
    );
    if (response.status !== 200) {
      console.error('failed to send telegram message:', {
        input: args,
        request: {
          body: args,
        },
        response: {
          res: response,
          body: await response.json(),
        },
      });
      throw new Error('Failed to send message');
    }
  },
});

/**
 * Logs a message to the database
 */
export const _logMessage = internalMutation({
  args: {
    raw: v.any(),
    formatted: telegramPayloadConvexSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('telegram_message_logs', args);
  },
});
