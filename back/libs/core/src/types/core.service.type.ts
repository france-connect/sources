/* istanbul ignore file */

// Declarative code
export type ComputeIdp = { idpId: string; subIdp: string };
export type ComputeSp = {
  spId: string;
  entityId?: string;
  subSp: string;
  hashSp: string;
};
