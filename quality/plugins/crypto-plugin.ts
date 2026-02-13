import { createHash } from 'crypto';

interface CreateHexaHashArgs {
  text: string;
  length?: number;
}

export function createHexaHash(args: CreateHexaHashArgs): string {
  const { length = 10, text } = args;
  const hash = createHash('sha512').update(text).digest('hex');
  return hash.substring(0, length);
}
