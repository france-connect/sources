import { Role, ServiceProvider, ServiceProviderRole } from '../types';
import { getRolesByUserIdAndEntity } from './role-helper';

const SERVICE_PROVIDER_ENTITY = 'ServiceProvider';

export const getServiceProviderBySpId = (
  serviceProviders: ServiceProvider[],
  spId: string,
): ServiceProvider => {
  const serviceProvider = serviceProviders.find(
    (sp: ServiceProvider) => sp.spId === spId,
  );
  expect(serviceProvider, `No serviceProvider found with the spId '${spId}'`).to
    .exist;
  return serviceProvider;
};

export const getServiceProviderRolesByUserId = (
  roles: Role[],
  serviceProviders: ServiceProvider[],
  userId: string,
): ServiceProviderRole[] => {
  const rolesFound = getRolesByUserIdAndEntity(
    roles,
    userId,
    SERVICE_PROVIDER_ENTITY,
  );
  return rolesFound.map((role: Role) => {
    const serviceProvider = getServiceProviderBySpId(
      serviceProviders,
      role.entityId,
    );
    return {
      roleType: role.roleType,
      serviceProvider,
    };
  });
};

export enum serviceProviderStatus {
  ARCHIVED = 'archivé',
  PRODUCTION_ACCESS_PENDING = 'en attente d’accès à la production',
  PRODUCTION_LIVE = 'en production',
  PRODUCTION_READY = 'prêt à mettre en production',
  REVIEW_IN_PROGRESS = 'recette en cours',
  REVIEW_REFUSED = 'recette refusée',
  REVIEW_REQUESTED = 'en attente de recette',
  REVIEW_VALIDATED = 'recette validée',
  REVIEW_WAITING_CLIENT_FEEDBACK = 'en attente de retour',
  SANDBOX = 'en intégration',
}
