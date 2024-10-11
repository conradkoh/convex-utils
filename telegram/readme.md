# Convex Telegram Helpers

## Usage

## Generate a new telegram secret

1. Generate a new secret token

    ```sh
    npx bun src/utils/telegram/scripts/generate-webhook-secret.ts
    ```

2. Set the secret token in the environment variables in your convex console

    ```sh
    npx convex env set TELEGRAM_WEBHOOK_SECRET <your-secret-token>
    ```
3. Set the bot token in the environment variables in your convex console

    ```sh
    # bot token generated from @BotFather
    npx convex env set TELEGRAM_BOT_TOKEN <your-bot-token>
    ```

## Preparing Convex
This enables you to inspect messages from the convex console.
1. Expose the schema extension in `convex/schema.ts`
    ```ts
    import { telegramMessageLogSchemaExtension } from '@/utils/telegram/convex/extensions/schema';
    import { defineSchema } from 'convex/server';

    const schema = defineSchema({
      ...telegramMessageLogSchemaExtension,
    });

    export default schema;
    ```
2. Expose the function extensions in `convex/telegram.ts`
    ```ts
    export * from '@/utils/telegram/convex/extensions/functions';
    ```


## Registering the webhook

1. Implement a http endpoint in `convex/http.ts` to handle the webhook in

   ```ts
    import { httpRouter } from 'convex/server';
    import { httpAction } from './_generated/server';
    import {
      logMessage,
      sendMessage,
    } from '@/utils/telegram';
    import { parseTelegramPayload } from '@/utils/telegram/types';
    const http = httpRouter();
    http.route({
      path: '/onMessage',
      method: 'POST',
      handler: httpAction(async (ctx, req) => {
        try {
          const raw = await req.json();
          await logMessage(ctx, raw); //log the message
          const formatted = parseTelegramPayload(raw);
          // validation checks
          if (!formatted.message?.chat?.id) {
            console.log('chat id not found', formatted);
            return new Response(null, { status: 200 });
          }
          if (!formatted.message?.from.id) {
            console.log('from id not found', formatted);
            return new Response(null, { status: 200 });
          }

          // TODO: Implement Processing
          const responseText = 'hello';

          //Send response
          await sendMessage(
            ctx,
            { chatId: formatted.message?.chat.id },
            async (tg) => {
              return [tg.text(responseText)];
            }
          );
          return new Response(null, { status: 200 });
        } catch (error) {
          console.error('unexpected error', error);
          return new Response(null, { status: 200 }); //we don't want telegram to retry errors
        }
      }),
    });

    export default http;
   ```
2. Execute the `_registerWebhook` function from the convex console to register the webhook with telegram. Remember that this needs to be run for each environment.

3. Send a test message to the bot and ensure that the message is received.