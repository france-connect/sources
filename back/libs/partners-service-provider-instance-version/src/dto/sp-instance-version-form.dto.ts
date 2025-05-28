import { Expose } from 'class-transformer';

import {
  $IsIpAddressesAndRange,
  $IsLength,
  $IsNumeric,
  $IsRedirectURL,
  $IsSignedResponseAlg,
  $IsString,
  $IsValidRedirectURLList,
  $IsWebsiteURL,
  $Matches,
  Choice,
  FieldsChoice,
  Form,
  FormDtoBase,
  Input,
  Text,
} from '@fc/dto2form';
import {
  OidcClientInterface,
  PlatformEnum,
  PlatformTechnicalKeyEnum,
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
    order: 20,
  })
  @Expose()
  readonly platformSection: string;

  @Choice({
    type: FieldsChoice.RADIO,
    required: true,
    order: 21,
    options: [
      {
        label: PlatformEnum.FRANCECONNECT,
        value: PlatformTechnicalKeyEnum.CORE_FCP,
      },
      {
        label: PlatformEnum.FRANCECONNECT_PLUS,
        value: PlatformTechnicalKeyEnum.CORE_FCP_HIGH,
        disabled: true,
      },
    ],
    initialValue: PlatformTechnicalKeyEnum.CORE_FCP,
    validators: [$IsString()],
  })
  @Expose()
  readonly platform: PlatformTechnicalKeyEnum;

  @Text({
    order: 40,
  })
  @Expose()
  readonly spInformationSection: string;

  @Input({
    order: 41,
    validators: [$IsLength({ max: 7 }), $IsNumeric()],
  })
  @Expose()
  readonly signupId: string;

  @Text({
    order: 60,
  })
  @Expose()
  readonly spConfigurationSection: string;

  @Input({
    required: true,
    array: true,
    order: 61,
    validators: [$IsWebsiteURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly site: string[];

  @Input({
    required: true,
    array: true,
    order: 62,
    validators: [
      $IsRedirectURL(),
      $IsValidRedirectURLList(),
      $IsLength({ max: 1024 }),
    ],
  })
  @Expose()
  readonly redirect_uris: string[];

  @Input({
    required: true,
    array: true,
    order: 63,
    validators: [$IsRedirectURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly post_logout_redirect_uris: string[];

  @Input({
    order: 64,
    validators: [$IsWebsiteURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly sector_identifier_uri: string;

  @Input({
    array: true,
    order: 70,
    validators: [$IsIpAddressesAndRange()],
  })
  @Expose()
  readonly IPServerAddressesAndRanges: string[];

  @Choice({
    type: FieldsChoice.RADIO,
    required: true,
    order: 75,
    options: [
      {
        label: SignatureAlgorithmEnum.ES256,
        value: SignatureAlgorithmEnum.ES256,
      },
      {
        label: SignatureAlgorithmEnum.RS256,
        value: SignatureAlgorithmEnum.RS256,
      },
    ],
    validators: [$IsString(), $IsSignedResponseAlg()],
  })
  @Expose()
  readonly id_token_signed_response_alg: SignatureAlgorithmEnum;

  @Text({
    order: 80,
  })
  @Expose()
  readonly subSection: string;

  @Input({
    order: 81,
    validators: [$IsLength({ max: 64, min: 36 }), $Matches(/^[a-zA-Z0-9-]+$/)],
  })
  @Expose()
  readonly entityId: string;
}
