import { ModuleRef } from '@nestjs/core';

import { Instantiable } from '@fc/common';

import {
  FeatureHandlerEmptyException,
  FeatureHandlerUnregisteredException,
} from '../exceptions';
import { FeatureHandlerNoHandler } from '../handlers';
import { IFeatureHandler } from '../interfaces';
import { FeatureHandler } from './feature-handler.decorator';

describe('FeatureHandler exception decorator', () => {
  let featureHandlerServiceMock;
  let ctx;
  beforeEach(() => {
    FeatureHandler.getInternalMappingForTestingPurposes().clear();

    featureHandlerServiceMock = {
      handle: jest.fn(),
    } as unknown as Instantiable<IFeatureHandler>;

    ctx = {
      moduleRef: {
        get: jest.fn(),
      },
    };
  });

  describe('get()', () => {
    it('should retrieve a `FeatureHandlerNoHandler` response for a `null` featureHandler request', async () => {
      // Given
      const resultMock = new FeatureHandlerNoHandler();
      // Then
      const result = FeatureHandler.get(null, ctx);
      expect(result).toStrictEqual(resultMock);
    });

    it('should throw an `Error` if an empty string as key is requested', async () => {
      // Given
      const emptyFeatureHandlerTopicGetMock = '';

      // When
      // Then
      expect(() =>
        FeatureHandler.get(emptyFeatureHandlerTopicGetMock, ctx),
      ).toThrow(FeatureHandlerEmptyException);
    });

    it('should throw an `Error` if an `undefined` featureHandler is requested', async () => {
      // Given
      const emptyFeatureHandlerMock = undefined;
      // When
      // Then
      expect(() => FeatureHandler.get(emptyFeatureHandlerMock, ctx)).toThrow(
        FeatureHandlerEmptyException,
      );
    });

    it('should retrieve a instantiated class for a given existing featureHandler', async () => {
      // Given
      const featureHandlerServiceMock = class {
        async handle(): Promise<void> {
          return;
        }
      };

      const featureHandlerTopicMock = 'core-fcp-eidas-verify';
      FeatureHandler.getInternalMappingForTestingPurposes().set(
        featureHandlerTopicMock,
        featureHandlerServiceMock,
      );
      ctx.moduleRef.get.mockResolvedValueOnce(featureHandlerServiceMock);
      // When
      const result = await FeatureHandler.get(
        featureHandlerTopicMock,
        // the ctx must contains a module
        ctx as unknown as { moduleRef: ModuleRef },
      );
      // Then
      expect(result).toStrictEqual(featureHandlerServiceMock);
    });

    it('should failed if a undefined feature handler is requested', () => {
      // Given
      expect.assertions(1);
      const emptyKey = undefined;
      // When
      expect(
        () =>
          FeatureHandler.get(
            emptyKey,
            // the ctx must contains a module
            ctx as unknown as { moduleRef: ModuleRef },
          ),
        // Then
      ).toThrow(FeatureHandlerEmptyException);
    });

    it('should failed if a empty feature handler was registered', () => {
      // Given
      expect.assertions(1);
      const emptyResponseMock = undefined;
      const featureHandlerFakeTopicMock = 'doesnt-exists';

      FeatureHandler.getInternalMappingForTestingPurposes().set(
        featureHandlerFakeTopicMock,
        emptyResponseMock,
      );

      // When
      expect(
        () =>
          FeatureHandler.get(
            featureHandlerFakeTopicMock,
            // the ctx must contains a module
            ctx as unknown as { moduleRef: ModuleRef },
          ),
        // Then
      ).toThrow(FeatureHandlerUnregisteredException);
    });
  });

  describe('getAll()', () => {
    it('should retrieve the mapping list of all setted FeatureHandler decorator', async () => {
      // Given
      const featureHandlerTopicMock = 'core-fcp-eidas-verify';
      FeatureHandler.getInternalMappingForTestingPurposes().set(
        featureHandlerTopicMock,
        featureHandlerServiceMock,
      );
      const resultKeysMock = [featureHandlerTopicMock];
      // When
      const result = FeatureHandler.getAll();
      // Then
      expect(result).toStrictEqual(resultKeysMock);
    });
  });
});
