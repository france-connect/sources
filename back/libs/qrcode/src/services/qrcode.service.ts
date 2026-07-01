import { toDataURL } from 'qrcode';

import { Injectable } from '@nestjs/common';

@Injectable()
export class QrcodeService {
  async generateDataUrl(
    data: string,
    options: Record<string, unknown>,
  ): Promise<string> {
    const dataUrl = await toDataURL(data, options);

    return dataUrl;
  }
}
