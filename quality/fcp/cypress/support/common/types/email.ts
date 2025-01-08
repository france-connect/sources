import { type Email as baseEmail } from 'cypress-maildev/build/types/Email';

interface Attachment {
  contentType: string;
  fileName: string;
  transferEncoding: string;
  contentDisposition: string;
  generatedFileName: string;
  contentId: string;
  checksum: string;
  length: number;
}

export type Email = baseEmail & {
  attachments: Attachment[];
};
