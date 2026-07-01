import { MdocDocumentTypeNotFoundException } from '../exceptions';
import {
  MdocClaim,
  MdocDocumentInterface,
  MdocIssuerSignedItemInterface,
  SimpleDocumentInterface,
} from '../interfaces';

export function extractSimpleDocument<DocType>(
  documents: MdocDocumentInterface[],
  docType: string,
): SimpleDocumentInterface<DocType> {
  const document = getDocumentByType(documents, docType);

  if (!document) {
    throw new MdocDocumentTypeNotFoundException(docType);
  }

  const claims = {};

  for (const [namespace, items] of document.issuerSigned.nameSpaces) {
    claims[namespace] = extractClaims(items);
  }

  return {
    docType,
    claims: claims as DocType,
  };
}

export function extractClaims(
  items: readonly MdocIssuerSignedItemInterface[],
): MdocClaim {
  const claims = items
    .filter((item) => item.elementIdentifier)
    .reduce(
      (acc, item) => ({ ...acc, [item.elementIdentifier]: item.elementValue }),
      {} as MdocClaim,
    );

  return claims;
}

export function getDocumentByType(
  documents: MdocDocumentInterface[],
  docType: string,
): MdocDocumentInterface | undefined {
  return documents.find((document) => document.docType === docType);
}
