/* istanbul ignore file */

// declarative code
/**
 * @todo This interface is not complete, it should have the right attributes
 * that define the expected elements in the cookie's options.
 * This interface should be used in all files that use the cookie options.
 * @author Brice
 * @date 2021-04-16
 */
export interface ISessionCookieOptions {
  signed: boolean;
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  domain: string;
  sameSite: 'Strict' | 'Lax' | 'None' | boolean;
}
