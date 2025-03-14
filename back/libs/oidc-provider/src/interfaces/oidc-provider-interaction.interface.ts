interface UnknownObject {
  [key: string]: unknown;
}

interface PromptDetail {
  name: 'login' | 'consent' | string;
  reasons: string[];
  details: UnknownObject;
}

export interface ParamsInterface {
  [key: string]: string;
}

export interface InteractionInterface {
  readonly kind: 'Interaction';
  iat: number;
  exp: number;
  jti: string;
  returnTo: string;
  uid?: string;

  params: ParamsInterface;
  prompt: PromptDetail;
}
