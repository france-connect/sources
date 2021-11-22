import { createHash } from 'crypto';

import * as pkcs11js from 'pkcs11js';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { HsmConfig } from './dto';
import { Pkcs11Error, SignatureDigest } from './enums';

/**
 *  Support EC key prime field up to 521 bits
 *  @see https://en.wikipedia.org/wiki/Elliptic-curve_cryptography
 *  /!\ Do not modify without understanding the basics of the upper link /!\
 */
const MAX_SIG_OUTPUT_SIZE = 132;

/**
 * For documentation
 */
@Injectable()
export class HsmService {
  /**
   * Status of the connection with the HSM
   */
  private pkcs11Instance: pkcs11js.PKCS11;
  private pkcs11Session: Buffer;
  public shutdownConsumer: Function;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    try {
      const { libhsm } = this.config.get<HsmConfig>('Hsm');
      this.pkcs11Instance = this.instanciatePkcs11js(libhsm);
      this.pkcs11Session = this.openSessionWithTheHsm();
      this.authenticateWithTheHsm();
    } catch (e) {
      this.handleError(e);
    }
  }

  onModuleDestroy() {
    try {
      this.closeCurrentSessionWithTheHsm();
    } catch (e) {}
  }

  /**
   * Sign data using the HSM and a private EC key
   * @param privateKeyLabel the private key label
   * @param data data to sign as a Buffer
   * @param digest alg used to digest data before signing (default to sha256).
   * @returns signed data
   */
  async sign(
    data: Buffer,
    digest: SignatureDigest = SignatureDigest.SHA256,
  ): Promise<Buffer> {
    const { sigKeyCkaLabel } = this.config.get<HsmConfig>('Hsm');

    /** The hash is not computed by the HSM (would be too slow) */
    const hash = createHash(digest);

    hash.update(data);

    const dataDigest = hash.digest();

    try {
      /**
       * We use the HSM to sign our digest as specified in
       * @see https://www.cryptsoft.com/pkcs11doc/v211/group__SEC__12__4__2__ECDSA__WITHOUT__HASHING.html
       */
      const key = this.getPrivateKeySlotByLabel(sigKeyCkaLabel);

      this.pkcs11Instance.C_SignInit(
        this.pkcs11Session,
        { mechanism: pkcs11js.CKM_ECDSA },
        key,
      );

      const signature = this.pkcs11Instance.C_Sign(
        this.pkcs11Session,
        dataDigest,
        Buffer.alloc(MAX_SIG_OUTPUT_SIZE),
      );

      if (!(signature instanceof Buffer) || signature.length === 0) {
        throw new Error('E_SIG_NOT_FOUND');
      }

      /**
       * As "signature" here contain a raw formatted EC signature (two positive numbers "r" and "s" concatened)
       * for performances reasons, we need to encode it to a format that crypto (and so openssl) understand.
       */
      return signature;
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * Generate random value
   *
   * @param size length (bytes) of randomly generated content
   */
  public genRandom(size: number, encoding: BufferEncoding): string {
    const buffer = Buffer.alloc(size);

    const random = this.pkcs11Instance.C_GenerateRandom(
      this.pkcs11Session,
      buffer,
    );

    return random.toString(encoding);
  }

  /**
   * Instanciate the library pkcs11js
   * @param libPath the path of the shared .so library
   * @returns
   */
  private instanciatePkcs11js(libPath: string): pkcs11js.PKCS11 {
    const pkcs11Instance = new pkcs11js.PKCS11();

    pkcs11Instance.load(libPath);

    pkcs11Instance.C_Initialize();

    return pkcs11Instance;
  }

  /**
   * Open an anonym session with the HSM (give access to public objects in the HSM)
   */
  private openSessionWithTheHsm(): Buffer {
    const { virtualHsmSlot: slotIndex } = this.config.get<HsmConfig>('Hsm');

    const slots = this.pkcs11Instance.C_GetSlotList(true);

    return this.pkcs11Instance.C_OpenSession(
      slots[slotIndex],
      pkcs11js.CKF_SERIAL_SESSION,
    );
  }

  /**
   * Close the session with the HSM,
   */
  private closeCurrentSessionWithTheHsm(): void {
    this.pkcs11Instance.C_Logout(this.pkcs11Session);
    this.pkcs11Instance.C_CloseSession(this.pkcs11Session);
    this.pkcs11Instance.C_Finalize();
  }

  /**
   * Authenticated the current session (give access to private objects in the HSM)
   */
  private authenticateWithTheHsm(): void {
    const { pin } = this.config.get<HsmConfig>('Hsm');

    this.pkcs11Instance.C_Login(this.pkcs11Session, pkcs11js.CKU_USER, pin);
  }

  /**
   * Get a key slot in the HSM given a label
   * /!\ Be careful not to have more than one key with the same label in the HSM /!\
   * @param ckaLabel the label
   * @returns The slot of the FIRST key that match the given label.
   */
  private getPrivateKeySlotByLabel(ckaLabel): Buffer {
    this.pkcs11Instance.C_FindObjectsInit(this.pkcs11Session, [
      { type: pkcs11js.CKA_KEY_TYPE, value: pkcs11js.CKO_PRIVATE_KEY },
      { type: pkcs11js.CKA_LABEL, value: Buffer.from(ckaLabel, 'utf8') },
      { type: pkcs11js.CKA_SIGN, value: true },
    ]);

    let hObject: Buffer;

    try {
      hObject = this.pkcs11Instance.C_FindObjects(this.pkcs11Session);
    } catch (e) {
      throw e;
    } finally {
      this.pkcs11Instance.C_FindObjectsFinal(this.pkcs11Session);
    }

    return hObject;
  }

  private handleError(error: Error) {
    const [, type] = error.message.match(/^([A-Z_]+)/) || [];

    switch (type) {
      case Pkcs11Error.CKR_DEVICE_ERROR:
        this.shutdownConsumer();
        break;
      default:
        throw error;
    }
  }
}
