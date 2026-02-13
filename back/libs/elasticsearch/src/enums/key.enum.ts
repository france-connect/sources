export enum ElasticControlKeyEnum {
  IDENTITIES = 'nbOfIdentities',
  CONNECTIONS = 'nbOfConnections',
}

export const OTHER_BY_KEY: Record<
  ElasticControlKeyEnum,
  ElasticControlKeyEnum
> = {
  [ElasticControlKeyEnum.IDENTITIES]: ElasticControlKeyEnum.CONNECTIONS,
  [ElasticControlKeyEnum.CONNECTIONS]: ElasticControlKeyEnum.IDENTITIES,
};
