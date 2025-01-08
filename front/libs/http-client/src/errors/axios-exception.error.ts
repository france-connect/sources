import type { AxiosError } from 'axios';

export class AxiosException extends Error {
  public code: string | undefined;

  public status: number | undefined;

  constructor(public readonly error: AxiosError) {
    super(error?.message);

    this.code = error?.code;
    this.stack = error.stack;
    this.status = error?.status;
  }
}
