export enum ElasticControlPivotEnum {
  SP = 'sp',
  IDP = 'idp',
  IDP_PUBLIC_SP = 'idp_public_sp',
  IDP_PRIVATE_SP = 'idp_private_sp',
  SP_IDP_PAIR = 'sp_idp_pair',
}

export const PIVOT_FIELDS = {
  [ElasticControlPivotEnum.SP]: {
    groupFields: ['spId'],
    nameFields: ['spName', 'spType'],
  },
  [ElasticControlPivotEnum.IDP]: {
    groupFields: ['idpId'],
    nameFields: ['idpName'],
  },
  [ElasticControlPivotEnum.IDP_PUBLIC_SP]: {
    groupFields: ['idpId'],
    nameFields: ['idpName'],
    filterField: 'spType',
    filterValue: 'public',
  },
  [ElasticControlPivotEnum.IDP_PRIVATE_SP]: {
    groupFields: ['idpId'],
    nameFields: ['idpName'],
    filterField: 'spType',
    filterValue: 'private',
  },
  [ElasticControlPivotEnum.SP_IDP_PAIR]: {
    groupFields: ['spId', 'idpId'],
    nameFields: ['spName', 'idpName'],
  },
};
