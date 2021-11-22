import {
  BinaryToTextEncoding,
  createCipheriv,
  createDecipheriv,
  createHash,
  Encoding,
  randomBytes,
} from 'crypto';

import { Injectable } from '@nestjs/common';

import { LowEntropyArgumentException } from './exceptions';

const NONCE_LENGTH = 12;
const AUTHTAG_LENGTH = 16;
const CIPHER_HEAD_LENGTH = NONCE_LENGTH + AUTHTAG_LENGTH;
export const RANDOM_MIN_ENTROPY = 32;

@Injectable()
export class CryptographyService {
  /**
   * Encrypt the given data
   * Current implementation use symetrical AES-256-GCM.
   * @see https://crypto.stackexchange.com/a/18092
   * @param key the key to encrypt the data
   * @param data the data to encrypt
   * @returns the cipher as a base64 encoded string
   */
  encryptSymetric(key: string, data: string): string {
    const buffer = this.encrypt(key, data);

    return buffer.toString('base64');
  }

  /**
   * Decrypt the given cipher
   * Current implementation use symetrical AES-256-GCM.
   *
   * @see https://crypto.stackexchange.com/a/18092
   * @param key the key to encrypt the data
   * @param cipher the cipher to decrypt
   * @returns the data decrypted
   */
  decryptSymetric(key: string, data: string): string {
    const cipher = Buffer.from(data, 'base64');
    return this.decrypt(key, cipher);
  }

  hash(
    data: string,
    inputEncoding: Encoding = 'utf8',
    alg = 'sha256',
    outputDigest: BinaryToTextEncoding = 'hex',
  ) {
    const hash = createHash(alg);

    hash.update(data, inputEncoding);

    return hash.digest(outputDigest);
  }

  /**
   * Generates a random string
   *
   * @param byteLength length in bytes (32 minimum)
   * Since the digest is "hex" the resulting output string will be twice as long in characters.
   * The digest is hex to ensure URL encoding compatibility.
   */
  genRandomString(byteLength: number): string {
    if (byteLength < RANDOM_MIN_ENTROPY) {
      throw new LowEntropyArgumentException(byteLength);
    }
    return randomBytes(byteLength).toString('hex');
  }

  /**
   * Encrypt the given string.
   * Current implementation use symetrical AES-256-GCM.
   * @see https://crypto.stackexchange.com/a/18092
   * @param key the key to encrypt the data
   * @param data the data to encrypt
   * @returns the cipher
   */
  private encrypt(key: string, data: string): Buffer {
    const nonce = randomBytes(NONCE_LENGTH);

    const cipher = createCipheriv('aes-256-gcm', key, nonce, {
      authTagLength: AUTHTAG_LENGTH,
    });

    const ciphertext = cipher.update(data, 'utf8');
    cipher.final();
    const tag = cipher.getAuthTag();

    return Buffer.concat([nonce, tag, ciphertext]);
  }

  /**
   * Decrypt the given cipher.
   * Current implementation use symetrical AES-256-GCM.
   * @see https://crypto.stackexchange.com/a/18092
   * @param key the key to encrypt the data
   * @param cipher the cipher to decrypt
   * @returns the data decrypted
   */
  decrypt(key: string, cipher: Buffer): any {
    if (Buffer.byteLength(cipher) <= CIPHER_HEAD_LENGTH) {
      /**
       * @TODO #138 throw a specific exception
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/138
       */
      throw new Error('Authentication failed !');
    }

    const nonce = cipher.slice(0, 12);
    const tag = cipher.slice(12, 28);
    const ciphertext = cipher.slice(28);

    const decipher = createDecipheriv('aes-256-gcm', key, nonce, {
      authTagLength: AUTHTAG_LENGTH,
    });

    decipher.setAuthTag(tag);

    const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

    try {
      decipher.final();
    } catch (err) {
      /**
       * @TODO #138 throw a specific exception
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/138
       */
      throw new Error('Authentication failed !');
    }

    return receivedPlaintext;
  }
}
