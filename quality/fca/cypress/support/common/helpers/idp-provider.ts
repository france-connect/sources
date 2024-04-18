import { IdentityProvider } from '../../common/types';

const DEFAULT_IDP_DESCRIPTION = 'par défaut';
type IdentityProviderAttributesFilter = {
  acrValue?: string;
  encryption?: string;
  signature?: string;
  usable?: boolean;
};

export const getIdentityProviderNameByDescription = (
  identityProviders: IdentityProvider[],
  description: string,
  shouldExist = true,
): string | undefined => {
  const { name: idpName } =
    getIdentityProviderByDescription(
      identityProviders,
      description,
      shouldExist,
    ) ?? {};

  return idpName;
};

export const getIdentityProviderByAttributes = (
  identityProviders: IdentityProvider[],
  filters: IdentityProviderAttributesFilter,
): IdentityProvider => {
  const attrFilters = { ...filters };
  attrFilters.usable ??= true;
  const search = Object.entries(attrFilters).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  const identityProvider: IdentityProvider = identityProviders.find((idp) =>
    search.every(([attribute, value]) => idp[attribute] === value),
  );
  expect(
    identityProvider,
    `No active identity provider has ${JSON.stringify(search, null, 2)}`,
  ).to.exist;
  return identityProvider;
};

export const getIdentityProviderByDescription = (
  identityProviders: IdentityProvider[],
  description: string,
  shouldExist = true,
): IdentityProvider | undefined => {
  const identityProvider: IdentityProvider = identityProviders.find(
    (identityProvider) => identityProvider.descriptions.includes(description),
  );
  if (shouldExist) {
    expect(
      identityProvider,
      `No identity provider matches the description '${description}'`,
    ).to.exist;
  }
  return identityProvider;
};

export const getDefaultIdentityProvider = (
  identityProviders: IdentityProvider[],
): IdentityProvider =>
  getIdentityProviderByDescription(identityProviders, DEFAULT_IDP_DESCRIPTION);
