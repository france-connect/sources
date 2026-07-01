import { Expose } from 'class-transformer';

import {
  $IsIpAddressesAndRange,
  $IsLength,
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
  SignatureAlgorithmEnum,
} from '@fc/service-provider';

@Form()
export class ServiceProviderInstanceVersionFromSpDto
  extends FormDtoBase
  implements Partial<OidcClientInterface>
{
  @Text({
    order: 0,
  })
  @Expose()
  readonly nameSection: string;

  @Input({
    required: true,
    order: 1,
    validators: [$IsString(), $IsLength({ max: 256 })],
  })
  @Expose()
  readonly name: string;

  @Text({
    order: 60,
  })
  @Expose()
  readonly configurationSection: string;

  @Input({
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
    seeAlso:
      'https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-bac-a-sable/#configuration-de-votre-instance-de-test',
  })
  @Expose()
  readonly redirect_uris: string[];

  @Input({
    order: 63,
    validators: [$IsWebsiteURL(), $IsLength({ max: 1024 })],
    seeAlso:
      'https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-sector_identifier/',
  })
  @Expose()
  readonly sector_identifier_uri: string;

  @Input({
    required: true,
    array: true,
    order: 64,
    validators: [$IsRedirectURL(), $IsLength({ max: 1024 })],
  })
  @Expose()
  readonly post_logout_redirect_uris: string[];

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
    seeAlso:
      'https://docs.partenaires.franceconnect.gouv.fr/fs/fs-technique/fs-technique-oidc-fc-plus/#signature-et-chiffrement-des-jetons-1',
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
    validators: [$IsLength({ max: 64, min: 32 }), $Matches(/^[a-zA-Z0-9-]+$/)],
    seeAlso:
      'https://docs.partenaires.franceconnect.gouv.fr/fs/devenir-fs/projet-bac-a-sable/#gestion-des-subs-pour-votre-fournisseur-de-service',
  })
  @Expose()
  readonly entityId: string;
}
