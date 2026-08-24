import { Openid4vpInteractionStatus } from '../enums';

export interface StatusEventInterface {
  interactionId: string;
  status: Openid4vpInteractionStatus;
}
