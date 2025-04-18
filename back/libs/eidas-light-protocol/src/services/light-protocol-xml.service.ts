import { lowerFirst, set, upperFirst } from 'lodash';
import { json2xml, xml2json } from 'xml-js';

import { Injectable } from '@nestjs/common';

import { FunctionSafe } from '@fc/common';

import {
  EidasJsonToXmlException,
  EidasXmlToJsonException,
} from '../exceptions';
import { IPathsObject } from '../interfaces';

@Injectable()
export class LightProtocolXmlService {
  xmlToJson(xmlDoc: string) {
    try {
      const options = { compact: true, spaces: 2 };

      const stringifiedJson = xml2json(xmlDoc, options);
      const json = JSON.parse(stringifiedJson);

      return json;
    } catch (error) {
      throw new EidasXmlToJsonException(error);
    }
  }

  jsonToXml(json) {
    try {
      const options = { compact: true, ignoreComment: true, spaces: 2 };

      const stringifiedJson = JSON.stringify(json);

      return json2xml(stringifiedJson, options);
    } catch (error) {
      throw new EidasJsonToXmlException(error);
    }
  }

  recurseOnChildBasedOnType(child: unknown, newPath: string, tree) {
    if (child instanceof Array) {
      for (let i = 0; i < child.length; i++) {
        this.jsonToPathsObject(child[i], `${newPath}.${i}`, tree);
      }
    } else {
      this.jsonToPathsObject(child, newPath, tree);
    }
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  jsonToPathsObject(parent: unknown, lastPath = '', tree = {}) {
    if (typeof parent === 'string') {
      tree[lastPath] = parent;
    } else if (parent !== null && typeof parent === 'object') {
      Object.entries(parent).forEach(([key, child]: [string, unknown]) => {
        const newPath = lastPath ? `${lastPath}.${key}` : key;

        this.recurseOnChildBasedOnType(child, newPath, tree);
      });
    }

    return tree;
  }

  removeDeclarationFields(pathsObject: IPathsObject): IPathsObject {
    return this.forEachPath(
      pathsObject,
      (keyPath: string, value: unknown): Array<[string, unknown]> => {
        if (!keyPath.match(/^_declaration/)) {
          return [[keyPath, value]];
        }
      },
    );
  }

  addDeclarationFields(pathsObject: IPathsObject): IPathsObject {
    return {
      '_declaration._attributes.version': '1.0',
      '_declaration._attributes.encoding': 'UTF-8',
      '_declaration._attributes.standalone': 'yes',
      ...pathsObject,
    };
  }

  upsertNodeToPathObject(
    pathsObject: IPathsObject,
    node: string,
    value: string,
  ): IPathsObject {
    return {
      ...pathsObject,
      [node]: value,
    };
  }

  /**
   * Retrieves the last part of an URL or URN (can be an Enum)
   * Ex. "toto" in "titi:tutu:tata:toto"
   * @param value The element we want to parse
   * @returns the last element
   */
  stripUrlAndUrnForProps(pathsObject: IPathsObject, props: string[]) {
    const propsMatch = props.join('|');

    return this.forEachPath(
      pathsObject,
      (keyPath: string, value: unknown): Array<[string, unknown]> => {
        if (keyPath.match(propsMatch) && typeof value === 'string') {
          return [[keyPath, value.split(/[:/]/).pop()]];
        } else {
          return [[keyPath, value]];
        }
      },
    );
  }

  prefixProps(pathsObject: IPathsObject, props: string[], prefix: string) {
    const propsMatch = props.join('|');

    return this.forEachPath(
      pathsObject,
      (keyPath: string, value: unknown): Array<[string, unknown]> => {
        if (keyPath.match(propsMatch) && typeof value === 'string') {
          return [[keyPath, `${prefix}${value}`]];
        } else {
          return [[keyPath, value]];
        }
      },
    );
  }

  lowerCaseFirstCharForProps(pathsObject: IPathsObject, props: string[]) {
    const propsMatch = props.join('|');

    return this.forEachPath(
      pathsObject,
      (keyPath: string, value: unknown): Array<[string, unknown]> => {
        if (keyPath.match(propsMatch) && typeof value === 'string') {
          return [[keyPath, lowerFirst(value)]];
        } else {
          return [[keyPath, value]];
        }
      },
    );
  }

  upperCaseFirstCharForProps(pathsObject: IPathsObject, props: string[]) {
    const propsMatch = props.join('|');

    return this.forEachPath(
      pathsObject,
      (keyPath: string, value: unknown): Array<[string, unknown]> => {
        if (keyPath.match(propsMatch) && typeof value === 'string') {
          return [[keyPath, upperFirst(value)]];
        } else {
          return [[keyPath, value]];
        }
      },
    );
  }

  pathsObjectToJson(pathsObject: IPathsObject): IPathsObject {
    const final = {};

    this.forEachPath(pathsObject, (keyPath: string, value: unknown): void => {
      set(final, keyPath, value);
    });

    return final;
  }

  addFailureStatus(pathsObject: IPathsObject): IPathsObject {
    if (pathsObject['lightResponse.status.statusCode'] === 'Success') {
      return {
        ...pathsObject,
        'lightResponse.status.failure': 'false',
      };
    } else {
      return {
        ...pathsObject,
        'lightResponse.status.failure': 'true',
      };
    }
  }

  replaceInPaths(pathsObject: IPathsObject, from: string | RegExp, to: string) {
    return this.forEachPath(pathsObject, (keyPath, value) => {
      return [[keyPath.replace(from, to), value]];
    });
  }

  forEachPath(pathsObject: IPathsObject, callback: FunctionSafe): IPathsObject {
    const newPathsObject = {};

    Object.entries(pathsObject).forEach(
      ([keyPath, value]: [string, unknown]) => {
        const newPaths: string[][] = callback(keyPath, value) || [];

        const cleaner = ([newKeyPath, newValue]) => newKeyPath && newValue;
        const newPathsData = Object.fromEntries(newPaths.filter(cleaner));
        Object.assign(newPathsObject, newPathsData);
      },
    );

    return newPathsObject;
  }
}
