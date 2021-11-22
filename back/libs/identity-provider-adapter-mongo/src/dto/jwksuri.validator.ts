import {
  isURL,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { MetadataIdpAdapterMongoDTO } from './identity-provider-adapter-mongo.dto';

const symetricAlgs = ['HS256', 'HS512'];

@ValidatorConstraint({ name: 'JwksUri', async: false })
export class JwksUriValidator implements ValidatorConstraintInterface {
  validate(JwksUri: string, args: ValidationArguments) {
    const {
      discovery,
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_signed_response_alg,
      // OIDC defined name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg,
    } = args.object as MetadataIdpAdapterMongoDTO;

    const isUserInfoAlgAsymetric = !symetricAlgs.includes(
      userinfo_signed_response_alg,
    );
    const isIdTOkenAlgAsymetric = !symetricAlgs.includes(
      id_token_signed_response_alg,
    );

    const shouldHaveJwksUri =
      !discovery && (isUserInfoAlgAsymetric || isIdTOkenAlgAsymetric);

    // Ensure that both expressions have the same boolean value
    // This allow us to check is jwksUrl is valid and should be or the inverse
    const isValid = isURL(JwksUri) === shouldHaveJwksUri;

    return isValid;
  }

  defaultMessage() {
    return 'JwkURL should not be present with symetric signature algorithms and/or discovery on';
  }
}
