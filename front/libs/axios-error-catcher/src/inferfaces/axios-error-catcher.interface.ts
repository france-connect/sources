export interface AxiosErrorCatcherInterface {
  initialized: boolean;
  hasError: boolean;
  codeError: number | undefined;
}
