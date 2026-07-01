import { MdocIssuerSignedItemInterface } from './mdoc-issuer-signed-item.interface';

export type MdocIssuerNameSpaces = ReadonlyMap<
  string,
  readonly MdocIssuerSignedItemInterface[]
>;
