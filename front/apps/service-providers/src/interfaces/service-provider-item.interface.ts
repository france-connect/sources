/* istanbul ignore file */

// declarative file
export interface ServiceProviderItem {
  id: string;
  name: string;
  platform: {
    name: string;
  };
  datapasses: { remoteId: number }[];
  createdAt: string;
  status: string;
  organisation: { name: string };
}
