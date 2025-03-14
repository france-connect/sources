import { BaseException } from '../exceptions';

export class ExceptionCaughtEvent {
  constructor(
    public readonly exception: BaseException,
    public readonly context: any,
  ) {}
}
