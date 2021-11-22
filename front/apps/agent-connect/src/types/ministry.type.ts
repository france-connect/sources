/* istanbul ignore file */

// declarative file
export type Ministry = {
  id: string;
  identityProviders: string[];
  name: string;
};

export type MinistryWithSlug = Ministry & {
  slug: string;
};
