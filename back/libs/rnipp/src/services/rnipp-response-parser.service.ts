import * as _ from 'lodash';
import * as xmlParser from 'xml2js';

import { Injectable } from '@nestjs/common';

import { CitizenStatus, RnippPivotIdentity } from '../dto';
import { RnippResponseCodes, RnippXmlSelectors } from '../enums';
import { RnippHttpStatusException } from '../exceptions';
import { GivenNameScopeInterface } from '../interfaces';
import { getGenderFromRnippGender } from '../mappers';

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
    const rnippCode = this.getXmlAttribute<string>(
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

    const { givenName, givenNameArray } = this.getGivenNamesAttribute(
      parsedXml,
      RnippXmlSelectors.GIVEN_NAME,
    );

    const birthcountry = this.getBirthcountryAttribute(
      parsedXml,
      RnippXmlSelectors.BIRTH_PLACE,
      RnippXmlSelectors.BIRTH_COUNTRY,
    );

    const birthplace = this.getBirthplaceAttribute(
      parsedXml,
      RnippXmlSelectors.BIRTH_PLACE,
      birthcountry,
    );

    const identity: RnippPivotIdentity = {
      gender: this.getGenderFromParsedXml(parsedXml, RnippXmlSelectors.GENDER),
      family_name: this.getXmlAttribute<string>(
        parsedXml,
        RnippXmlSelectors.FAMILY_NAME,
      ),
      given_name: givenName,
      given_name_array: givenNameArray,
      birthdate: this.getBirthdateAttribute(
        parsedXml,
        RnippXmlSelectors.BIRTH_DATE,
      ),
      birthplace,
      birthcountry,
    };

    return {
      identity,
      deceased,
      rnippCode,
    };
  }

  private getXmlAttribute<T>(
    parsedXml: JSON,
    path: string,
    // force lodash to any because get method from lodash waitin any third parameter
    defaultValue: any = '',
  ): T {
    return _.get(parsedXml, path, defaultValue);
  }

  private getGenderFromParsedXml(parsedXml: JSON, path: string): string {
    const rnippGender = this.getXmlAttribute<string>(parsedXml, path);

    const gender = getGenderFromRnippGender(rnippGender);
    return gender;
  }

  private getGivenNamesAttribute(
    parsedXml: JSON,
    path: string,
  ): GivenNameScopeInterface {
    const givenNames = this.getXmlAttribute<string[]>(parsedXml, path, []);
    return {
      givenName: givenNames.join(' '),
      givenNameArray: givenNames,
    };
  }

  private getDeceasedStateAttribute(parsedXml: JSON, path: string): boolean {
    return !!this.getXmlAttribute<boolean>(parsedXml, path, false);
  }

  private getBirthdateAttribute(
    parsedXml: JSON,
    birthdatePath: string,
  ): string | null {
    const birthdate = this.getXmlAttribute<string>(parsedXml, birthdatePath);

    if (birthdate.length !== 10) {
      if (birthdate.match(/^[0-9]{4}$/)) {
        return `${birthdate}-01-01`;
      }

      if (birthdate.match(/^[0-9]{4}-[0-9]{2}$/)) {
        return `${birthdate}-01`;
      }
    }

    return birthdate;
  }

  private getBirthplaceAttribute(
    parsedXml: JSON,
    birthplacePath: string,
    birthcountry: string,
  ): string {
    let birthplace = this.getXmlAttribute<string>(parsedXml, birthplacePath);

    if (birthcountry !== FRANCE_COG) {
      birthplace = '';
    }

    return birthplace;
  }

  private getBirthcountryAttribute(
    parsedXml: JSON,
    birthplacePath: string,
    birthcountryPath: string,
  ): string {
    const birthplace = this.getXmlAttribute<string>(parsedXml, birthplacePath);

    const birthcountry = this.getXmlAttribute<string>(
      parsedXml,
      birthcountryPath,
    );

    if (!birthplace && !birthcountry) {
      return '';
    }

    return birthcountry || FRANCE_COG;
  }
}
