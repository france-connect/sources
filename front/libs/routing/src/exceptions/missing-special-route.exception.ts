import { RoutingBaseException } from './routing-base.exception';

export class MissingSpecialRouteException extends RoutingBaseException {
  constructor(path: string) {
    super();
    this.message = `${this.scope} Missing special route: ${path}`;
  }
}
