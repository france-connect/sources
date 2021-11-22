import * as otplib from 'otplib';

export async function getTotp(key) {
  if (Cypress.env('TOTP_WINDOW') === 'loose') {
    return otplib.authenticator.generate(key);
  }

  return new Promise(resolve => {
    const ttl = otplib.authenticator.timeRemaining();
    // If TOTP expires in less than 2 seconds
    // we'll wait for the next timeframe
    // in order to be sure to have a valid TOTP
    // at the time the form is submited
    const wait = ttl < 2 ? ttl + 1 : 0;

    setTimeout(() => {
      resolve(otplib.authenticator.generate(key));
    }, wait * 1000);
  });
}
