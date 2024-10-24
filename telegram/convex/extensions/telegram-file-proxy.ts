import { getFileResponse_zodSchema } from '@/utils/telegram/convex/types';
import { Photo, photo_zodSchema } from '@/utils/telegram/types';
import { document_zodSchema } from '@/utils/telegram/types/incoming-message/document';
import { mimeTypeForFile } from '@/utils/web/mime';
import { httpAction } from 'convex/_generated/server';
import { httpRouter } from 'convex/server';
import { z } from 'zod';

/**
 * This is a helper class to bind the telegram route for file proxying
 * Refer to the readme for more information
 */

export class TelegramFileProxy {
  /**
   * Bind the telegram route for file proxying
   * This primarily allows us to have links that do not expose the bot token to the public
   * @param http
   */
  static BindHTTP(http: ReturnType<typeof httpRouter>) {
    http.route({
      path: '/files/telegram',
      method: 'GET',
      handler: httpAction(async (ctx, req) => {
        try {
          const params = proxyReqParams_zodSchema.parse(
            Object.fromEntries(new URL(req.url).searchParams.entries())
          );
          const TELEGRAM_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
          const TELEGRAM_BASE_FILE_URL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}`;
          // get file metadata
          const fileMeta = getFileResponse_zodSchema.parse(
            await (
              await fetch(
                `${TELEGRAM_BASE_URL}/getFile?file_id=${params.file_id}`
              )
            ).json()
          );
          // get file content
          const fileContentURL = `${TELEGRAM_BASE_FILE_URL}/${fileMeta.result.file_path}`;
          const fileContentReq = await fetch(fileContentURL);
          const fileContent = await fileContentReq.blob();

          if (fileMeta.ok) {
            const contentType = fileContentReq.headers.get('Content-Type');
            if (contentType === null) {
              throw new Error('Content-Type header is missing');
            }

            return new Response(fileContent, {
              headers: {
                'Content-Type': mimeTypeForFile(fileMeta.result.file_path), //this uses the native browser type which allows viewing
                // 'Content-Type': contentType, //this will force a download instead when it is application/octet-stream
                'Content-Disposition': `inline; filename="${fileMeta.result.file_path}"`,
              },
            });
          }

          return new Response(
            JSON.stringify(
              {
                fileMeta,
                fileContent: fileContentReq,
              },
              null,
              2
            ),
            { status: 400 }
          );
        } catch (err) {
          return new Response(
            JSON.stringify(
              {
                error: err,
              },
              null,
              2
            ),
            { status: 400 }
          );
        }
      }),
    });
  }

  /**
   * Generate the proxy file URL
   * @param f
   */
  static GenerateFileURL(f: File): string {
    switch (f.type) {
      case 'document': {
        const doc = f.document;
        return `${process.env.CONVEX_SITE_URL}/files/telegram?file_id=${doc.file_id}`;
      }
      case 'photo': {
        const photo = f.photo;
        if (photo && photo.length > 0) {
          // each message can only have one "photo", but with different resolutions. we choose the highest res one
          let maxResPhoto: Photo = photo[0] as Photo;
          for (const p of photo) {
            if (p.file_size > maxResPhoto.file_size) {
              maxResPhoto = p;
            }
          }
          return `${process.env.CONVEX_SITE_URL}/files/telegram?file_id=${maxResPhoto.file_id}`;
        }
        throw new Error('No photo found in list');
      }
      default: {
        // exhaustive check
        const _: never = f;
        throw new Error('Invalid file type');
      }
    }
  }
}

//========================================
// Types
//========================================
type File = z.infer<typeof file_zodSchema>;
const file_zodSchema = z.union([
  z.object({
    type: z.literal('document'),
    document: document_zodSchema,
  }),
  z.object({
    type: z.literal('photo'),
    photo: z.array(photo_zodSchema),
  }),
]);

const proxyReqParams_zodSchema = z.object({
  file_id: z.string(),
});
