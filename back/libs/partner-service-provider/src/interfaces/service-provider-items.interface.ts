import { Datapass, Organisation, Platform } from '.';

export interface IServiceProviderItem {
  name: string;
  platform: Pick<Platform, 'name'>;
  status: string;
  organisation: Pick<Organisation, 'name'>;
  datapasses: Pick<Datapass, 'remoteId'>[];
  createdAt: Date;
}
