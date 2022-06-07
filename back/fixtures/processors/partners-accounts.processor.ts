import { pbkdf2Sync } from 'crypto';

import { IProcessor } from 'typeorm-fixtures-cli';

import { Account } from '../../entities/typeorm';

export default class AccountProcessor implements IProcessor<Account> {
  preProcess(name: string, account: Account): Account {
    console.info(`Generating password for fixture "${name}" !`);
    const derivedKey = pbkdf2Sync(
      account.password,
      process.env.Cryptography_PASSWORD_SALT,
      100000,
      64,
      'sha512',
    );

    return { ...account, password: derivedKey.toString('hex') };
  }
}
