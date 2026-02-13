import { ElasticErrorInterface } from '../interfaces';

export function isNotFound(e: ElasticErrorInterface): boolean {
  return e?.statusCode === 404;
}
