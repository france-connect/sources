import { Expose } from 'class-transformer';

import {
  $IsIpAddressesAndRange,
  $IsLength,
  $IsNumeric,
  $IsRedirectURL,
  $IsSignedResponseAlg,
  $IsString,
  $IsWebsiteURL,
  $Matches,
  Form,
  FormDtoBase,
  Input,
  Text,
} from '@fc/dto2form';
import {
  OidcClientInterface,
  SignatureAlgorithmEnum,
} from '@fc/service-provider';

@Form()
export class ServiceProviderInstanceVersionDto
  extends FormDtoBase
  implements Partial<OidcClientInterface>
{
  @Input({
    required: true,
    order: 1,
    validators: [$IsString(), $IsLength({ max: 256 })],
  })
  @Expose()
  readonly name: string;

  @Input({
    readonly: true,
    order: 2,
    validators: [$IsString()],
  })
  @Expose()
  readonly client_id: string;

  @Input({
    readonly: true,
    order: 3,
    validators: [$IsString()],
  })
  @Expose()
  readonly client_secret: string;

  @Text({
    order: 10,
  })
  @Expose()
  readonly spInformationSection: string;

  @Input({
    order: 11,
    validators: [$IsLength({ max: 7 }), $IsNumeric()],
  })
  @Expose()
  readonly signupId: string;

  @Text({
    order: 20,
  })
  @Expose()
  readonly spConfigurationSection: string;

  @Input({
    required: true,
    array: true,
    order: 21,
    validators: [$IsWebsiteURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly site: string[];

  /**
   * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
   * #1842
   */
  @Input({
    required: true,
    array: true,
    order: 22,
    validators: [$IsRedirectURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly redirect_uris: string[];

  /**
   * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
   * #1842
   */
  @Input({
    required: true,
    array: true,
    order: 23,
    validators: [$IsRedirectURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly post_logout_redirect_uris: string[];

  @Input({
    array: true,
    order: 24,
    validators: [$IsIpAddressesAndRange()],
  })
  @Expose()
  readonly IPServerAddressesAndRanges: string[];

  @Input({
    required: true,
    order: 25,
    validators: [$IsString(), $IsSignedResponseAlg()],
  })
  @Expose()
  readonly id_token_signed_response_alg: SignatureAlgorithmEnum;

  @Text({
    order: 30,
  })
  @Expose()
  readonly subSection: string;

  @Input({
    order: 31,
    validators: [$IsLength({ max: 64, min: 36 }), $Matches(/^[a-zA-Z0-9-]+$/)],
  })
  @Expose()
  readonly entityId: string;
}
