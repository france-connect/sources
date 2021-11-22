import * as _ from 'lodash';
import * as xmlParser from 'xml2js';

import { Injectable } from '@nestjs/common';

import { CitizenStatus } from '../dto';
import { Genders, RnippResponseCodes, RnippXmlSelectors } from '../enums';
import { RnippHttpStatusException } from '../exceptions';

const FRANCE_COG = '99100';

@Injectable()
export class RnippResponseParserService {
  public async parseRnippData(xmlData: string): Promise<CitizenStatus> {
    // this.logger.debug(`Serializer XML ${xmlData}`);
    const options = {
      // strips the xml namespace prefix. E.g <foo:Bar/> will become 'Bar'. (N.B.: the xmlns prefix is NOT stripped.
      tagNameProcessors: [xmlParser.processors.stripPrefix],
    };

    let json;
    try {
      json = await xmlParser.parseStringPromise(xmlData, options);
    } catch (error) {
      throw new RnippHttpStatusException();
    }

    return this.extractXmlAttributes(json);
  }

  private extractXmlAttributes(parsedXml: JSON): any {
    const rnippCode: string = this.getXmlAttribute(
      parsedXml,
      RnippXmlSelectors.RNIPP_CODE,
    );

    if (
      rnippCode !== RnippResponseCodes.FOUND_NOT_RECTIFIED &&
      rnippCode !== RnippResponseCodes.FOUND_RECTIFIED
    ) {
      return { rnippCode };
    }

    const deceased: boolean = this.getDeceasedStateAttribute(
      parsedXml,
      RnippXmlSelectors.DECEASED,
    );

    const identity: /* IIdentity */ any = {
      gender: this.getGenderFromParsedXml(parsedXml, RnippXmlSelectors.GENDER),
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: this.getXmlAttribute(
        parsedXml,
        RnippXmlSelectors.FAMILY_NAME,
      ),
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: this.getGivenNamesAttribute(
        parsedXml,
        RnippXmlSelectors.GIVEN_NAME,
      ),
      birthdate: this.getXmlAttribute(parsedXml, RnippXmlSelectors.BIRTH_DATE),
      birthplace: this.getXmlAttribute(
        parsedXml,
        RnippXmlSelectors.BIRTH_PLACE,
      ),
      birthcountry: this.getBirthcountryAttribute(
        parsedXml,
        RnippXmlSelectors.BIRTH_PLACE,
        RnippXmlSelectors.BIRTH_COUNTRY,
      ),
    };

    return {
      identity,
      deceased,
      rnippCode,
    };
  }

  private getXmlAttribute(
    parsedXml: JSON,
    path: string,
    defaultValue: any = '',
  ): any {
    return _.get(parsedXml, path, defaultValue);
  }

  private getGenderFromParsedXml(parsedXml: JSON, path: string): string {
    const rnippGender: string = this.getXmlAttribute(parsedXml, path);

    switch (rnippGender) {
      case 'F':
        return Genders.FEMALE;
      case 'M':
        return Genders.MALE;
      case 'U':
        return Genders.UNSPECIFIED;
      default:
        return '';
    }
  }

  private getGivenNamesAttribute(parsedXml: JSON, path: string): string {
    const givenNames: string[] = this.getXmlAttribute(parsedXml, path, []);

    return givenNames.join(' ');
  }

  private getDeceasedStateAttribute(parsedXml: JSON, path: string): boolean {
    return !!this.getXmlAttribute(parsedXml, path, false);
  }

  private getBirthcountryAttribute(
    parsedXml: JSON,
    birthplacePath: string,
    birthcountryPath: string,
  ): string {
    const birthplace = this.getXmlAttribute(parsedXml, birthplacePath);

    const birthcountry = this.getXmlAttribute(parsedXml, birthcountryPath);

    if (!birthplace && !birthcountry) {
      return '';
    }

    return birthcountry || FRANCE_COG;
  }
}
