import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { EidasRequest } from '@fc/eidas';

import { EidasLightProtocolConfig } from '../dto';
import { EidasJsonToXmlException } from '../exceptions';
import { IParsedToken } from '../interfaces';
import { LightProtocolCommonsService } from './light-protocol-commons.service';
import { LightProtocolXmlService } from './light-protocol-xml.service';

@Injectable()
export class LightRequestService {
  constructor(
    private readonly config: ConfigService,
    private readonly lightCommons: LightProtocolCommonsService,
    private readonly lightXml: LightProtocolXmlService,
  ) {}

  /**
   * Convert light request from JSON to XML
   * @param {EidasResponse} data
   */
  formatRequest(eidasRequest: EidasRequest): string {
    // Flatten the JSON to a paths object format
    let pathsObject = this.lightXml.jsonToPathsObject(eidasRequest);

    // Add lightRequest sub element
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /^/,
      'lightRequest.',
    );

    // Add XML declaration fields
    pathsObject = this.lightXml.addDeclarationFields(pathsObject);

    // Inflate the requestedAttributes element
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /requestedAttributes\.([0-9]+)/,
      'requestedAttributes.attribute.$1.definition',
    );

    // Uppercase the first character of the requested attributes
    pathsObject = this.lightXml.upperCaseFirstCharForProps(pathsObject, [
      'requestedAttributes',
    ]);

    // Add the namespace on the requested attributes
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['requestedAttributes'],
      'http://eidas.europa.eu/attributes/naturalperson/',
    );

    // Add the namespace for nameIdFormat attribute
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['nameIdFormat'],
      'urn:oasis:names:tc:SAML:1.1:nameid-format:',
    );

    // Add the namespace for levelOfAssurance attribute
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['levelOfAssurance'],
      'http://eidas.europa.eu/LoA/',
    );

    // Suffixe the lightRequest sub elements with "_text"
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /^lightRequest\.(.*)$/,
      'lightRequest.$1._text',
    );

    // Convert the paths object back to an inflated JSON
    const inflatedJson = this.lightXml.pathsObjectToJson(pathsObject);

    try {
      return this.lightXml.jsonToXml(inflatedJson);
    } catch (error) {
      throw new EidasJsonToXmlException(error);
    }
  }

  generateToken(id: string, issuer: string, date?: Date): string {
    const { lightRequestConnectorSecret } =
      this.config.get<EidasLightProtocolConfig>('EidasLightProtocol');

    return this.lightCommons.generateToken(
      id,
      issuer,
      lightRequestConnectorSecret,
      date,
    );
  }

  /**
   * Convert light request XML to JSON
   * @param {string} xml
   */
  parseRequest(xml: string): EidasRequest {
    // Parse the XML to JSON
    const json = this.lightXml.xmlToJson(xml);

    // Flatten the JSON to a paths object format
    let pathsObject = this.lightXml.jsonToPathsObject(json);

    // Remove the XML declaration header
    pathsObject = this.lightXml.removeDeclarationFields(pathsObject);

    // Transform single values to array in paths
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      'value._text',
      'value.0._text',
    );

    // Strip unecessary properties in paths
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      'lightRequest.',
      '',
    );
    pathsObject = this.lightXml.replaceInPaths(pathsObject, '._text', '');
    pathsObject = this.lightXml.replaceInPaths(pathsObject, '.definition', '');
    pathsObject = this.lightXml.replaceInPaths(pathsObject, '.attribute', '');

    // Strip unnecessary url or urn elements in some props values
    pathsObject = this.lightXml.stripUrlAndUrnForProps(pathsObject, [
      'levelOfAssurance',
      'nameIdFormat',
      'requestedAttributes',
    ]);

    // Lowercase the first character of requested attributes
    pathsObject = this.lightXml.lowerCaseFirstCharForProps(pathsObject, [
      'requestedAttributes',
    ]);

    // Convert the paths object back to an inflated JSON
    return this.lightXml.pathsObjectToJson(
      pathsObject,
    ) as unknown as EidasRequest;
  }

  parseToken(token: string): IParsedToken {
    const { lightRequestProxyServiceSecret } =
      this.config.get<EidasLightProtocolConfig>('EidasLightProtocol');

    return this.lightCommons.parseToken(token, lightRequestProxyServiceSecret);
  }
}
