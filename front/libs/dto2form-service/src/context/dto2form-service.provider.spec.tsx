import { fireEvent, render } from '@testing-library/react';
import React, { use } from 'react';

import { ConfigService } from '@fc/config';
import type { FormConfigInterface } from '@fc/forms';

import {
  createDTO2FormRouteLoaderFunc,
  getConfigEndpointsByIdHelper,
  getConfigFormByIdHelper,
} from '../helpers';
import type { Dto2FormServiceEndpointsInterface } from '../interfaces';
import { Dto2FormServiceContext } from './dto2form-service.context';
import { Dto2FormServiceProvider } from './dto2form-service.provider';

jest.mock('./dto2form-service.context');
jest.mock('../helpers/get-config-form-by-id/get-config-form-by-id.helper');
jest.mock('../helpers/get-config-endpoints-by-id/get-config-endpoints-by-id.helper');
jest.mock('../helpers/create-route-loader-func/create-route-loader-func.helper');

describe('Dto2FormServiceProvider', () => {
  // Given
  const configMock = {
    anyRouteConfigGetConfigFormById: {
      endpoints: Symbol(
        'anyRouteConfig-getConfigFormById',
      ) as unknown as Dto2FormServiceEndpointsInterface,
      form: Symbol('anyFormConfig-getConfigFormById') as unknown as FormConfigInterface,
    },
    anyRouteConfigLoadData: {
      endpoints: Symbol('anyRouteConfig-LoadData') as unknown as Dto2FormServiceEndpointsInterface,
      form: Symbol('anyFormConfig-LoadData') as unknown as FormConfigInterface,
    },
    anyRouteGetConfigEndpointsById: {
      endpoints: Symbol(
        'anyRouteConfig-GetConfigEndpointsById',
      ) as unknown as Dto2FormServiceEndpointsInterface,
      form: Symbol('anyFormConfig-GetConfigEndpointsById') as unknown as FormConfigInterface,
    },
  };

  const ProviderConsumerMock = () => {
    const context = use(Dto2FormServiceContext);
    return (
      <React.Fragment>
        <button
          data-testid="Dto2FormServiceProvider.getConfigEndpointsById.button"
          onClick={() => {
            context?.getConfigEndpointsById('anyRouteGetConfigEndpointsById');
          }}>
          getConfigEndpointsById mock button
        </button>
        <button
          data-testid="Dto2FormServiceProvider.getConfigFormById.button"
          onClick={() => {
            context?.getConfigFormById('anyRouteConfigGetConfigFormById');
          }}>
          getConfigFormById mock button
        </button>
        <button
          data-testid="Dto2FormServiceProvider.loadData.button"
          onClick={() => {
            context?.loadData('anyRouteConfigLoadData');
          }}>
          loadData mock button
        </button>
      </React.Fragment>
    );
  };

  const Provider = () => (
    <Dto2FormServiceProvider>
      <ProviderConsumerMock />
    </Dto2FormServiceProvider>
  );

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue(configMock);
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<Provider />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should retrieve the configuration for the current instance', () => {
    // When
    render(<Provider />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Dto2FormService');
  });

  describe('getConfigEndpointsById', () => {
    it('should call getConfigEndpointsByName', () => {
      // When
      const { getByTestId } = render(<Provider />);
      const button = getByTestId('Dto2FormServiceProvider.getConfigEndpointsById.button');
      fireEvent.click(button);

      // Then
      expect(getConfigEndpointsByIdHelper).toHaveBeenCalledExactlyOnceWith(
        'anyRouteGetConfigEndpointsById',
        configMock,
      );
    });

    it('should return getConfigEndpointsByName value', () => {
      // Given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest
        .mocked(getConfigEndpointsByIdHelper)
        .mockReturnValueOnce(configMock.anyRouteGetConfigEndpointsById.endpoints);

      // When
      render(<Provider />);
      const result = useCallbackSpy.mock.calls[0][0]('any-acme-endpoint');

      // Then
      expect(result).toEqual(configMock.anyRouteGetConfigEndpointsById.endpoints);
    });
  });

  describe('getConfigFormById', () => {
    it('should call getConfigFormByName', () => {
      // When
      const { getByTestId } = render(<Provider />);
      const button = getByTestId('Dto2FormServiceProvider.getConfigFormById.button');
      fireEvent.click(button);

      // Then
      expect(getConfigFormByIdHelper).toHaveBeenCalledExactlyOnceWith(
        'anyRouteConfigGetConfigFormById',
        configMock,
      );
    });

    it('should return getConfigFormByName value', () => {
      // Given
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest
        .mocked(getConfigFormByIdHelper)
        .mockReturnValueOnce(configMock.anyRouteGetConfigEndpointsById.form);

      // When
      render(<Provider />);
      const result = useCallbackSpy.mock.calls[1][0]('any-acme-form');

      // Then
      expect(result).toEqual(configMock.anyRouteGetConfigEndpointsById.form);
    });
  });

  describe('loadData', () => {
    it('should call getConfigEndpointsByName', () => {
      // When
      const { getByTestId } = render(<Provider />);
      const button = getByTestId('Dto2FormServiceProvider.loadData.button');
      fireEvent.click(button);

      // Then
      expect(getConfigEndpointsByIdHelper).toHaveBeenCalledExactlyOnceWith(
        'anyRouteConfigLoadData',
        configMock,
      );
    });

    it('should call createRouteLoaderFunc', () => {
      // Given
      jest
        .mocked(getConfigEndpointsByIdHelper)
        .mockReturnValueOnce(configMock.anyRouteConfigLoadData.endpoints);

      // When
      const { getByTestId } = render(<Provider />);
      const button = getByTestId('Dto2FormServiceProvider.loadData.button');
      fireEvent.click(button);

      // Then
      expect(createDTO2FormRouteLoaderFunc).toHaveBeenCalledExactlyOnceWith(
        configMock.anyRouteConfigLoadData.endpoints,
      );
    });

    it('should return createRouteLoaderFunc value', () => {
      // Given
      const loaderFunc = jest.fn();
      const useCallbackSpy = jest.spyOn(React, 'useCallback');
      jest.mocked(createDTO2FormRouteLoaderFunc).mockReturnValueOnce(loaderFunc);

      // When
      render(<Provider />);
      const result = useCallbackSpy.mock.calls[2][0]('any-acme-form');

      // Then
      expect(result).toEqual(loaderFunc);
    });
  });
});
