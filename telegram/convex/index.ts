import { TelegramMessageBuilder } from '@/utils/telegram/classes/TelegramMessageBuilder';
import { parseTelegramPayload } from '@/utils/telegram/types';
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
export const logMessage = async (ctx: ActionCtx, raw: any, addInfo?: any) => {
  await ctx.runMutation(internal.telegram._logMessage, {
    raw,
    formatted: parseTelegramPayload(raw),
    addInfo,
  });
};

/**
 * Reexport types from the telegram helpers
 */
export * from './types';
