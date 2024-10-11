# OpenAI Helpers
## Setup
Install the openai API key into your environment variables
```sh
npx convex env set OPENAI_API_KEY <your-openai-api-key>
```

## Usage

### Parse
```ts
import { openAIParse } from '@/utils/openai';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const response = await openAIParse({
  systemPrompt: 'You are a helpful assistant',
  text: 'Hello',
  schema,
});

console.log(response);
```