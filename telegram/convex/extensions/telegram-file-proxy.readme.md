# Telegram File Proxy
This helper class is used to bind the telegram route for file proxying, to generate URLs that allow public access to telegram files without exposing the bot token.

## Setup
```ts
import { TelegramFileProxy } from '@/utils/telegram/convex/extensions/telegram-file-proxy';
const http = httpRouter();
TelegramFileProxy.BindHTTP(http);
```

## Usage

### Get the publicly accessible file URL when a message is received
```ts
const http = httpRouter();
http.route({
  path: '/onMessage',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const message = parseTelegramPayload(await req.json());
    const fileUrl = TelegramFileProxy.GenerateFileURL({ type: 'document', document: message.message.document });
    //process whatever else you need with this url
    return new Response(null, { status: 200 });
  });
})
```