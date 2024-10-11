import { TelegramMessageBuilder } from '@/utils/telegram/classes/TelegramMessageBuilder';
import {
  parseTelegramPayload,
  WebhookPayload,
} from '@/utils/telegram/convex/types';
import { internal } from 'convex/_generated/api';
import { ActionCtx } from 'convex/_generated/server';

/**
 * Sends a message to telegram
 * @param handler
 */
export const sendMessage = async (
  ctx: ActionCtx,
  to: {
    chatId: number;
  },
  handler: (
    tg: Omit<TelegramMessageBuilder, 'build' | 'chatId'>
  ) =>
    | Promise<[message: TelegramMessageBuilder]>
    | [message: TelegramMessageBuilder]
) => {
  const t = new TelegramMessageBuilder();
  t.chatId(to.chatId);
  const [builder] = await handler(t);
  const message = builder.build();
  await ctx.runAction(internal.telegram._sendMessage, message);
};

/**
 * Logs a message to the database
 * @param ctx
 * @param message
 */
export const logMessage = async (ctx: ActionCtx, raw: any) => {
  await ctx.runMutation(internal.telegram._logMessage, {
    raw,
    formatted: parseTelegramPayload(raw),
  });
};

/**
 * Reexport types from the telegram helpers
 */
export * from './types';
