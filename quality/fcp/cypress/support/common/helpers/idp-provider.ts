import { IdentityProviderInterface } from '../../common/types';

const DEFAULT_IDP_DESCRIPTION = 'par défaut';
type IdentityProviderAttributesFilter = {
  acrValue?: string;
  encryption?: string;
  signature?: string;
  usable?: boolean;
};

export const getIdentityProviderNameByDescription = (
  identityProviders: IdentityProviderInterface[],
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
  identityProviders: IdentityProviderInterface[],
  filters: IdentityProviderAttributesFilter,
): IdentityProviderInterface => {
  const attrFilters = { ...filters };
  attrFilters.usable ??= true;
  const search = Object.entries(attrFilters).filter(
    ([, value]) => value !== undefined && value !== null,
  );
  const identityProvider = identityProviders.find((idp) =>
    search.every(([attribute, value]) => idp[attribute] === value),
  );
  expect(
    identityProvider,
    `No active identity provider has ${JSON.stringify(search, null, 2)}`,
  ).to.exist;
  return identityProvider;
};

export const getIdentityProviderByDescription = (
  identityProviders: IdentityProviderInterface[],
  description: string,
  shouldExist = true,
): IdentityProviderInterface | undefined => {
  const identityProvider = identityProviders.find((identityProvider) =>
    identityProvider.descriptions.includes(description),
  );
  if (shouldExist) {
    expect(
      identityProvider,
      `No identity provider matches the description '${description}'`,
    ).to.exist;
  }
  return identityProvider;
};

export const getIdentityProviderByNameOrDescription = (
  identityProviders: IdentityProviderInterface[],
  idpNameOrDescription: string,
  shouldExist = true,
): IdentityProviderInterface | undefined => {
  const identityProvider = identityProviders.find(
    ({ descriptions, name }) =>
      name === idpNameOrDescription ||
      descriptions.includes(idpNameOrDescription),
  );
  if (shouldExist) {
    expect(
      identityProvider,
      `No identity provider matches the name or description '${idpNameOrDescription}'`,
    ).to.exist;
  }
  return identityProvider;
};

export const getDefaultIdentityProvider = (
  identityProviders: IdentityProviderInterface[],
): IdentityProviderInterface =>
  getIdentityProviderByDescription(identityProviders, DEFAULT_IDP_DESCRIPTION);
