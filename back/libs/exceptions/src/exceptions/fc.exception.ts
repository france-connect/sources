import { Description, Loggable } from '../decorator';

@Loggable()
@Description()
export class FcException extends Error {
  /**
   * Inform about which module triggered the error
   * Each module should have a unique id
   *
   * Legacy codes:
   * - 00: Core
   * - 01: RNIPP
   * - 02: Identity Providers (IdP)
   * - 03: Service providers (SP)
   * - 04: Data providers (DP)
   * - 05: eIDAS
   *
   * @since core-fcp-high :
   * @since core-v2:
   * - 06: eIDAS Client
   * - 07: eIDAS Provider
   * - 09: Mock Service Providers (Mock SP)
   * - 16: Cryptography
   * - 17: Consumer-HSM
   * - 18: Account
   * - 19: Session
   * - 20: Feature Handler
   * - 27: Mailer
   * - 80: Exceptions
   */
  public scope: number;

  /**
   * Unique id for the error being reported
   * @see https://confluence.kaliop.net/display/FC/Codes+erreurs+des+applications
   * @TODO #140 derivate the above documentation from the code itself?
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/140
   */
  public code: number;

  public originalError?: Error;
  public redirect: boolean;

  constructor(input?: Error | string) {
    let arg: unknown = input;

    if (input instanceof Error) {
      arg = input.message;
    }

    super(arg as string);

    if (input instanceof Error) {
      this.originalError = input;
    }

    this.redirect = false;
  }
}
