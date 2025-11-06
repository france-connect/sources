export const TracksListComponent = jest.fn();

export enum TracksOptions {
  CONFIG_NAME = 'Tracks',
}

export enum CinematicEvents {
  DP_VERIFIED_FC_CHECKTOKEN = 'DP_VERIFIED_FC_CHECKTOKEN',
  FC_DATATRANSFER_CONSENT_IDENTITY = 'FC_DATATRANSFER_CONSENT_IDENTITY',
  FC_VERIFIED = 'FC_VERIFIED',
}

export enum EidasToLabel {
  eidas1 = 'Faible',
  eidas2 = 'Substantiel',
  eidas3 = 'Élevé',
}
