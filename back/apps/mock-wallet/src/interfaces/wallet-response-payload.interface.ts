export interface WalletResponsePayload {
  readonly state?: string;
  readonly vp_token: string;
  readonly presentation_submission: PresentationSubmission;
}

export interface PresentationSubmission {
  readonly id: string;
  readonly definition_id: string;
  readonly descriptor_map: DescriptorMap[];
}

export interface DescriptorMap {
  readonly id: string;
  readonly format: string;
  readonly path: string;
}
