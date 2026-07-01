import { Module } from '@nestjs/common';

import {
  MdocDecoderService,
  MdocService,
  MdocVerifierService,
} from './services';

@Module({
  providers: [MdocDecoderService, MdocVerifierService, MdocService],
  exports: [MdocService],
})
export class MdocModule {}
