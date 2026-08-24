import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { parameterizedPath, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EudiDocTypes, EudiPidDto, EudiPidInterface } from '@fc/eudi';
import { extractSimpleDocument, SimpleDocumentInterface } from '@fc/mdoc';
import {
  CONFIG_NAMESPACE,
  Openid4vpConfig,
  Openid4vpInteractionDto,
  Openid4vpInteractionStatus,
  Openid4vpService,
} from '@fc/openid4vp';

import { DEFAULT_ERROR, DEFAULT_ERROR_DESCRIPTION } from '../constants';
import { AuthorizeRequestUriParamsDto, AuthorizeResponseBodyDto } from '../dto';
import { WalletBridgeRoutes } from '../enums';
import {
  WalletBridgeInvalidInteractionStatusException,
  WalletBridgeInvalidPidException,
} from '../exceptions';

@Controller()
export class OpenId4vpApiController {
  constructor(
    private readonly config: ConfigService,
    private readonly openid4vp: Openid4vpService,
  ) {}

  /**
   * @todo Consume requestObject ?
   * Check the spec to see if the requestObject should be used only once.
   */
  @Get(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_REQUEST_OBJECT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Header('cache-control', 'no-store')
  @Header('content-type', 'application/oauth-authz-req+jwt')
  async authorizeRequestObject(
    @Param() { interactionId }: AuthorizeRequestUriParamsDto,
  ) {
    const interaction = await this.openid4vp.getInteractionById(interactionId);
    const requestObject = await this.openid4vp.getRequestObject(interaction);

    await this.openid4vp.setAuthorizationRequestObjectAsRead(interaction);

    return requestObject.jar.authorizationRequestJwt;
  }

  @Post(WalletBridgeRoutes.OPENID4VP_AUTHORIZE_RESPONSE)
  @Header('cache-control', 'no-store')
  @Header('content-type', 'application/json;charset=UTF-8')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async authorizeResponse(@Body() body: AuthorizeResponseBodyDto) {
    const { state, error } = body;

    const interaction = await this.openid4vp.getInteractionByState(state);

    if (
      interaction.status !== Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED
    ) {
      throw new WalletBridgeInvalidInteractionStatusException();
    }

    /** @todo #2676 Handle errors sent inside the encrypted JWE response */
    if (error) {
      await this.saveWalletError(interaction, body);

      return {};
    }

    let identity: SimpleDocumentInterface<EudiPidInterface>;

    try {
      identity = await this.extractIdentity(body, interaction);
    } catch (exception) {
      await this.openid4vp.saveError(
        interaction,
        DEFAULT_ERROR,
        DEFAULT_ERROR_DESCRIPTION,
      );

      throw exception;
    }

    await this.openid4vp.saveResponse(interaction, [identity]);

    const { relayingParty } =
      this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    return {
      redirect_uri: parameterizedPath(relayingParty.redirectUri, {
        interactionId: interaction.id,
      }),
    };
  }

  private async saveWalletError(
    interaction: Openid4vpInteractionDto,
    body: AuthorizeResponseBodyDto,
  ): Promise<void> {
    const { error, error_description: errorDescription } = body;

    await this.openid4vp.saveError(
      interaction,
      error,
      errorDescription || DEFAULT_ERROR_DESCRIPTION,
    );
  }

  private async extractIdentity(
    body: AuthorizeResponseBodyDto,
    interaction: Openid4vpInteractionDto,
  ): Promise<SimpleDocumentInterface<EudiPidInterface>> {
    const documents = await this.openid4vp.parseResponse(body, interaction);

    const identity = extractSimpleDocument<EudiPidInterface>(
      documents,
      EudiDocTypes.PID,
    );

    const errors = await validateDto(identity, EudiPidDto, {
      whitelist: true,
    });

    if (errors.length > 0) {
      throw new WalletBridgeInvalidPidException(errors);
    }

    return identity;
  }
}
