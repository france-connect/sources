export interface BuildMdocDcqlQueryInputInterface {
  readonly id: string;
  readonly doctype: string;
  readonly requiredPaths: readonly string[];
  readonly optionalPaths: readonly string[];
  readonly intentToRetain: boolean;
}
