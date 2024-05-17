import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IIdpAgentKeys } from '../interfaces';
import { AccountFca } from '../schemas';

@Injectable()
export class AccountFcaService {
  constructor(@InjectModel('AccountFca') private model: Model<AccountFca>) {}

  async getAccountByIdpAgentKeys(
    idpIdentityKeys: IIdpAgentKeys,
  ): Promise<AccountFca> {
    return await this.model.findOne({
      'idpIdentityKeys.idpSub': idpIdentityKeys.idpSub,
      'idpIdentityKeys.idpUid': idpIdentityKeys.idpUid,
    });
  }

  createAccount(): AccountFca {
    const sub = uuid();
    return new this.model({ sub });
  }

  async upsertWithSub(account: AccountFca): Promise<void> {
    await this.model.findOneAndUpdate(
      {
        sub: account.sub,
      },
      account,
      { upsert: true },
    );
  }
}
