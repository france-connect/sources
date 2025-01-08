import { DelegationScope, DelegationScopeConfig } from '@fc/core-fcp';

export default {
  delegationScope: [
    DelegationScope.ARGENT_IMPOTS_CONSOMMATION,
    DelegationScope.ETRANGER_EUROPE,
    DelegationScope.FAMILLE_SCOLARITE,
    DelegationScope.JUSTICE,
    DelegationScope.LOGEMENT,
    DelegationScope.LOISIR_SPORT_CULTURE,
    DelegationScope.PAPIER_CITOYENNETE_ELECTION,
    DelegationScope.SOCIAL_SANTE,
    DelegationScope.TRANSPORTS_MOBILITE,
    DelegationScope.TRAVAIL_FORMATION,
  ],
} as DelegationScopeConfig;
