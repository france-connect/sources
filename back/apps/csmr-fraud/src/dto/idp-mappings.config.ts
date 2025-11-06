import { IsObject } from 'class-validator';

/**
 * @TODO #2073
 * Temoprary config for missing idpLabel, to remove in January 2026
 * */
export class IdpMappings {
  @IsObject()
  readonly mappings: Record<string, string>;
}
