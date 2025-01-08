import { Injectable } from '@nestjs/common';

import { Dto2FormInvalidMetadataException } from '../exceptions';
import { MetadataDtoInterface } from '../interfaces';
import { FORM_METADATA_TOKEN } from '../tokens';

@Injectable()
export class MetadataFormService {
  constructor() {}

  getDtoMetadata(dto: Function): MetadataDtoInterface[] {
    const metadata = Reflect.getMetadata(FORM_METADATA_TOKEN, dto);

    if (!metadata) {
      throw new Dto2FormInvalidMetadataException();
    }

    return metadata;
  }
}
