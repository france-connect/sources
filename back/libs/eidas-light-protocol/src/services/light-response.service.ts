import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { EidasResponse } from '@fc/eidas';

import { EidasLightProtocolConfig } from '../dto';
import { EidasJsonToXmlException } from '../exceptions';
import { IParsedToken, IPathsObject } from '../interfaces';
import { LightProtocolCommonsService } from './light-protocol-commons.service';
import { LightProtocolXmlService } from './light-protocol-xml.service';

@Injectable()
export class LightResponseService {
  constructor(
    private readonly config: ConfigService,
    private readonly lightCommons: LightProtocolCommonsService,
    private readonly lightXml: LightProtocolXmlService,
  ) {}

  /**
   * Convert light response from JSON to XML
   * @param {EidasResponse} data
   */
  formatResponse(eidasResponse: EidasResponse): string {
    let pathsObject = this.lightXml.jsonToPathsObject(eidasResponse);

    // Add lightResponse sub element
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /^/,
      'lightResponse.',
    );

    // Create a definition attribute and a value attribute for each attribute
    pathsObject = this.dissociateDefinitionsAndValues(pathsObject);

    // Uppercase the definition of the identity attributes
    pathsObject = this.lightXml.upperCaseFirstCharForProps(pathsObject, [
      'definition',
    ]);

    // Add the namespace for eidas identity attributes
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['definition'],
      'http://eidas.europa.eu/attributes/naturalperson/',
    );

    // Inflate the attributes element
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      'attributes.',
      'attributes.attribute.',
    );

    // Add XML declaration fields
    pathsObject = this.lightXml.addDeclarationFields(pathsObject);

    // Add the namespace for subjectNameIdFormat attribute
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['subjectNameIdFormat'],
      'urn:oasis:names:tc:SAML:2.0:nameid-format:',
    );

    // Add the namespace for statusCode, subStatusCode attribute
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['statusCode', 'subStatusCode'],
      'urn:oasis:names:tc:SAML:2.0:status:',
    );

    // Add the namespace for levelOfAssurance attribute
    pathsObject = this.lightXml.prefixProps(
      pathsObject,
      ['levelOfAssurance'],
      'http://eidas.europa.eu/LoA/',
    );

    // Suffixe the lightResponse sub elements with "_text"
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /^lightResponse\.(.*)$/,
      'lightResponse.$1._text',
    );

    // Convert the paths object back to an inflated JSON
    const json = this.lightXml.pathsObjectToJson(pathsObject);

    try {
      return this.lightXml.jsonToXml(json);
    } catch (error) {
      throw new EidasJsonToXmlException(error);
    }
  }

  generateToken(id: string, issuer: string, date?: Date): string {
    const { lightResponseProxyServiceSecret } =
      this.config.get<EidasLightProtocolConfig>('EidasLightProtocol');

    return this.lightCommons.generateToken(
      id,
      issuer,
      lightResponseProxyServiceSecret,
      date,
    );
  }

  /**
   * Convert light response XML to JSON
   * @param {string} xml
   */
  parseResponse(xml: string): EidasResponse {
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
      'lightResponse.',
      '',
    );
    pathsObject = this.lightXml.replaceInPaths(pathsObject, '._text', '');
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      'attributes.attribute',
      'attributes',
    );

    // Strip unnecessary url or urn elements in some props values
    pathsObject = this.lightXml.stripUrlAndUrnForProps(pathsObject, [
      'levelOfAssurance',
      'subjectNameIdFormat',
      'definition',
      'statusCode',
      'subStatusCode',
    ]);

    // Lowercase the first character of definition
    pathsObject = this.lightXml.lowerCaseFirstCharForProps(pathsObject, [
      'definition',
    ]);

    // Remap attributes to their corresponding definition
    pathsObject = this.mapValuesToDefinition(pathsObject);

    // remove unnecessary array in attributes
    pathsObject = this.lightXml.replaceInPaths(
      pathsObject,
      /^attributes\.[0-9]+/,
      'attributes',
    );

    // Transform failure boolean strings into booleans
    pathsObject = this.failureAttributeToBoolean(pathsObject);

    // Convert the paths object back to an inflated JSON
    return this.lightXml.pathsObjectToJson(
      pathsObject,
    ) as unknown as EidasResponse;
  }

  parseToken(token: string): IParsedToken {
    const { lightResponseConnectorSecret } =
      this.config.get<EidasLightProtocolConfig>('EidasLightProtocol');

    return this.lightCommons.parseToken(token, lightResponseConnectorSecret);
  }

  private getMapValuesToDefinitionForPath(state: {
    currentKey: string;
  }): Function {
    return (keyPath: string, value: unknown): Array<[string, unknown]> => {
      if (keyPath.match(/definition/) && typeof value === 'string') {
        state.currentKey = keyPath.replace('definition', value);
      } else if (keyPath.match(/value/)) {
        const [index] = keyPath.match(/value\.([0-9]+)/)[1];

        return [[`${state.currentKey}.${index}`, value]];
      } else {
        return [[keyPath, value]];
      }
    };
  }

  private mapValuesToDefinition(pathsObject: IPathsObject): IPathsObject {
    const state = {
      currentKey: undefined,
    };

    return this.lightXml.forEachPath(
      pathsObject,
      this.getMapValuesToDefinitionForPath(state),
    );
  }

  private getDissociateDefinitionsAndValuesForPath(state: {
    index: number;
    lastDefinition?: string;
  }): Function {
    return (keyPath: string, value: unknown): Array<[string, unknown]> => {
      if (!keyPath.match(/attributes\.[a-zA-Z]+/)) {
        return [[keyPath, value]];
      }

      const [, definition] = keyPath.match(/attributes\.([a-zA-Z]+)/);

      if (state.lastDefinition && definition !== state.lastDefinition) {
        state.index++;
      }
      state.lastDefinition = definition;

      const toReplace = new RegExp(`${definition}\\.[0-9]+`);
      const definitionKey = keyPath.replace(
        toReplace,
        `${state.index}\.definition`,
      );
      const valueKey = keyPath.replace(definition, `${state.index}\.value`);

      return [
        [definitionKey, definition],
        [valueKey, value],
      ];
    };
  }

  private dissociateDefinitionsAndValues(
    pathsObject: IPathsObject,
  ): IPathsObject {
    const state = {
      lastDefinition: undefined,
      index: 0,
    };

    return this.lightXml.forEachPath(
      pathsObject,
      this.getDissociateDefinitionsAndValuesForPath(state),
    );
  }

  private failureAttributeToBooleanForPath(
    keyPath: string,
    value: unknown,
  ): Array<[string, unknown]> {
    if (keyPath.match('status.failure')) {
      return [[keyPath, value === 'true']];
    } else {
      return [[keyPath, value]];
    }
  }

  private failureAttributeToBoolean(pathsObject: IPathsObject): IPathsObject {
    return this.lightXml.forEachPath(
      pathsObject,
      this.failureAttributeToBooleanForPath,
    );
  }
}
