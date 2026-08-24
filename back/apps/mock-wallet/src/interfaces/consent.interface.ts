import { Flows, MockWalletRoutes } from '../enums';

export interface ConsentViewModel {
  readonly flow: Flows;
  readonly availableClaims: string[];
  readonly responseUri: string;
  readonly responsePreview: string;
  readonly requestPayload: string;
  readonly responsePayload: string;
  readonly presentationDefinition: string;
  readonly submitUrl: MockWalletRoutes;
  readonly submitErrorUrl: MockWalletRoutes;
}

export interface SubmitResult {
  readonly statusCode: number;
  readonly responseBody: string;
  readonly redirectUri?: string;
}
