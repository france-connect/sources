import * as otplib from 'otplib';

const MIN_REMAINING_TIME = 5;

async function generateTotp(key): Promise<string> {
  return new Promise((resolve) => {
    const ttl = otplib.authenticator.timeRemaining();
    // If TOTP expires in less than 5 seconds
    // we'll wait for the next timeframe
    // in order to be sure to have a valid TOTP
    // at the time the form is submited
    const wait = ttl < MIN_REMAINING_TIME ? ttl + 1 : 0;

    setTimeout(() => {
      resolve(otplib.authenticator.generate(key));
    }, wait * 1000);
  });
}

interface TotpArgs {
  totpSecret: string;
}

export function getTotp(args: TotpArgs): Promise<string> {
  const { totpSecret } = args;
  return generateTotp(totpSecret);
}
