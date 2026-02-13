export interface PartnersServiceProviderPayloadInterface {
  id: string;
  name: string;
  organizationName: string;
  datapassRequestId: string;
  datapassScopes: string[];
  fcScopes: string[];
  createdAt: Date;
  updatedAt: Date;
}
