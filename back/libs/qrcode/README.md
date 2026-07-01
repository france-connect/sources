# @fc/qrcode

Thin NestJS wrapper around the [`qrcode`](https://www.npmjs.com/package/qrcode) package.

It generates QR code images as data URLs for display in EJS views (e.g. wallet-bridge OpenID4VP interaction page).

## Scope

In scope:

- `generateDataUrl(data, options)` → `data:image/png;base64,…` string suitable for an `<img src="…">`.

Out of scope:

- QR decoding, styling beyond what `qrcode` supports, or server-side caching of generated images.

## Usage

Import `QrcodeModule` and inject `QrcodeService`.

```typescript
import { Module } from '@nestjs/common';

import { QrcodeModule } from '@fc/qrcode';

@Module({
  imports: [QrcodeModule],
})
export class WalletBridgeModule {}
```

```typescript
import { Injectable } from '@nestjs/common';

import { QrcodeService } from '@fc/qrcode';

@Injectable()
export class MyUiService {
  constructor(private readonly qrcode: QrcodeService) {}

  async buildQrForUri(requestUri: string) {
    return this.qrcode.generateDataUrl(requestUri, {
      errorCorrectionLevel: 'H',
    });
  }
}
```

### Options

The second argument is forwarded to `qrcode.toDataURL`. Common options:

| Option | Example | Notes |
| --- | --- | --- |
| `errorCorrectionLevel` | `'H'` | Used by wallet-bridge for long `openid4vp://` URIs |
| `width` | `256` | Pixel width of the output image |
| `margin` | `2` | Quiet zone modules |

See the [qrcode package documentation](https://www.npmjs.com/package/qrcode#options-1) for the full list.

## Configuration

None. No environment variables or `ConfigService` namespace.

## Dependencies

- [`qrcode`](https://www.npmjs.com/package/qrcode) (npm)

## References

- Wallet-bridge usage: [`back/apps/wallet-bridge/src/controllers/openid4vp-ui.controller.ts`](../../apps/wallet-bridge/src/controllers/openid4vp-ui.controller.ts)
