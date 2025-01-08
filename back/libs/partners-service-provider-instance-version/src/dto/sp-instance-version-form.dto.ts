import {
  $IsNotEmpty,
  $IsString,
  $IsURL,
  $IsUUID,
  Form,
  Input,
} from '@fc/dto2form';

@Form()
export class ServiceProviderInstanceVersionDto {
  @Input({
    required: true,
    order: 1,
    validators: [$IsNotEmpty(), $IsString()],
  })
  // oidc fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly instance_name: string;

  @Input({
    required: true,
    order: 2,
    validators: [$IsNotEmpty(), $IsString()],
  })
  // oidc fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly sp_name: string;

  @Input({
    order: 3,
    validators: [$IsString()],
  })
  // oidc fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly signup_id: string;

  @Input({
    required: true,
    order: 4,
    validators: [$IsNotEmpty(), $IsURL()],
  })
  readonly site: string;

  /**
   * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
   * #1842
   */
  @Input({
    required: true,
    order: 5,
    validators: [$IsNotEmpty(), $IsURL()],
  })
  readonly redirect_uris: string;

  /**
   * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
   * #1842
   */
  @Input({
    required: true,
    order: 6,
    validators: [$IsNotEmpty(), $IsURL()],
  })
  readonly post_logout_redirect_uris: string;

  @Input({
    order: 7,
    validators: [$IsString()],
  })
  readonly ipAddresses: string;

  @Input({
    required: true,
    order: 8,
    validators: [$IsString()], // créer un validateur custom lié au valeur
    /**
     * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
     * #1842
     */
    // options: [
    //   {
    //     label: '',
    //     value: '',
    //   },
    //   {
    //     label: 'HS256',
    //     value: 'HS256',
    //   },
    //   {
    //     label: 'ES256',
    //     value: 'ES256',
    //   },
    //   {
    //     label: 'RS256',
    //     value: 'RS256',
    //   },
    // ],
  })
  readonly id_token_signed_response_alg: string;

  @Input({
    required: true,
    order: 9,
    validators: [$IsString()], // créer un validateur custom lié au valeur
    /**
     * @TODO Ajout de la gestion des champs multiples (ex URLs) sur la lib dto2form
     * #1842
     */
    // options: [
    //   {
    //     label: '',
    //     value: '',
    //   },
    //   {
    //     label: 'HS256',
    //     value: 'HS256',
    //   },
    //   {
    //     label: 'ES256',
    //     value: 'ES256',
    //   },
    //   {
    //     label: 'RS256',
    //     value: 'RS256',
    //   },
    // ],
  })
  readonly userinfo_signed_response_alg: string;

  @Input({
    required: true,
    order: 10,
    validators: [$IsNotEmpty(), $IsString()], // $IsBoolean
  })
  // oidc fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly use_entity_id: string;

  @Input({
    order: 11,
    validators: [$IsUUID()],
  })
  // oidc fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly entity_id: string;
}
