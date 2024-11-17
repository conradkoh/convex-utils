import { getFileResponse_zodSchema } from '@/utils/telegram/convex';

export class TelegramFileHelper {
  private _baseURL: string;
  private _baseFileURL: string;
  constructor() {
    this._baseURL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
    this._baseFileURL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  }
  private async _getMetadata(fileId: string) {
    const res = await fetch(`${this._baseURL}/getFile?file_id=${fileId}`);
    return await getFileResponse_zodSchema.parse(await res.json());
  }
  private async _getContent(filePath: string) {
    const res = await fetch(`${this._baseFileURL}/${filePath}`);
    const blob = await res.blob();
    return {
      blob,
      contentType: res.headers.get('Content-Type'),
    };
  }

  async getFileById(fileId: string) {
    const meta = await this._getMetadata(fileId);
    return {
      meta,
      getContent: async () => {
        return await this._getContent(meta.result.file_path);
      },
      getDerivedFileName() {
        const derivedFileNameWithExtension = meta.result.file_path
          .split('/')
          .pop();
        if (!derivedFileNameWithExtension) {
          throw new Error('File name is missing');
        }
        return derivedFileNameWithExtension;
      },
    };
  }
}
