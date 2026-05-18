import { OtrsErrorResponseInterface } from './otrs-error-response.interface';

export type OtrsSessionCreateResponseInterface = OtrsErrorResponseInterface & {
  SessionID: string;
};
