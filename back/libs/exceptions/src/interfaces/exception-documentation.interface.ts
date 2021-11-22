export interface IExceptionDocumentation {
  scope: number;
  code: number;
  errorCode: string;
  message: string;
  loggable: boolean;
  trackable: boolean;
  description: string;
  path: string;
  exception: string;
}
