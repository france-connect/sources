export interface ServiceProvider {
  name: string;
  datapassRequestId: string;
  datapassAuthorizationId: string;
  datapassEidasLevel: string;
  datapassScopes: string[];
  descriptions: string[];
  platform: string;
  organizationName: string;
  organizationSiret: string;
  applicantUserDescription: string;
  technicalUserDescription: string;
}
