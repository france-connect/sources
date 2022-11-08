export const ServiceProviderItemComponent = jest.fn(({ datapassId }) => (
  <div>ServiceProviderItemComponent {datapassId}</div>
));

export {
  ServiceProviderEditActionTypes,
  ServiceProvidersActionTypes,
  ServiceProvidersPermissionTypes,
  ServiceProviderViewActionTypes,
} from '@fc/service-providers';
