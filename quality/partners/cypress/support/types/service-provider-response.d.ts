export interface InstanceInterface {
  currentVersion: {
    createdAt: string;
    publicationStatus: string;
    updatedAt: string;
    data: { scope: string[] };
  };
}

export interface AccountPermissionInterface {
  account: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phone: string | null;
    lastConnection: Date;
  };
  permissionType: 'SP_ADMIN' | 'SP_TECH';
}

export interface ServiceProviderResponse {
  payload: {
    fcScopes: string[];
    instances: InstanceInterface[];
  };
  meta: {
    permissions: AccountPermissionInterface[];
  };
}
