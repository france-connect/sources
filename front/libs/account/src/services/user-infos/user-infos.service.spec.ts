import type { AxiosResponse } from 'axios';

import { get } from '@fc/http-client';

import * as Service from './user-infos.service';

describe('UserInfosService', () => {
  describe('fetchUserInfosErrorHandler', () => {
    it('should return with params', () => {
      // given
      const updateStateMock = jest.fn();

      // when
      const execFunc = Service.fetchUserInfosErrorHandler(updateStateMock);
      execFunc();

      // then
      expect(updateStateMock).toHaveBeenCalledWith({
        connected: false,
        expired: false,
        ready: true,
        userinfos: undefined,
      });
    });
  });

  describe('fetchUserInfosSuccessHandler', () => {
    it('should call the validator', () => {
      // given
      const updateStateMock = jest.fn();
      const ValidatorMock = { validate: jest.fn(() => true) };
      const data = { firstname: 'any-firstname-mock', lastname: 'any-firstname-mock' };

      // when
      const callback = Service.fetchUserInfosSuccessHandler(updateStateMock, ValidatorMock);
      callback({ data } as unknown as AxiosResponse);

      // then
      expect(ValidatorMock.validate).toHaveBeenCalledOnce();
      expect(ValidatorMock.validate).toHaveBeenCalledWith(data);
    });

    it('should call the update callback with params when user is known', () => {
      // given
      const updateStateMock = jest.fn();
      const ValidatorMock = { validate: jest.fn(() => true) };
      const data = { firstname: 'any-firstname-mock', lastname: 'any-firstname-mock' };

      // when
      const callback = Service.fetchUserInfosSuccessHandler(updateStateMock, ValidatorMock);
      callback({ data } as unknown as AxiosResponse);

      // then
      expect(updateStateMock).toHaveBeenCalledOnce();
      expect(updateStateMock).toHaveBeenCalledWith({
        connected: true,
        expired: false,
        ready: true,
        userinfos: data,
      });
    });

    it('should call the update callback with params when user is not known', () => {
      // given
      const updateStateMock = jest.fn();
      const ValidatorMock = { validate: jest.fn(() => false) };
      const data = { firstname: 'any-firstname-mock', lastname: 'any-firstname-mock' };

      // when
      const callback = Service.fetchUserInfosSuccessHandler(updateStateMock, ValidatorMock);
      callback({ data } as unknown as AxiosResponse);

      // then
      expect(updateStateMock).toHaveBeenCalledOnce();
      expect(updateStateMock).toHaveBeenCalledWith({
        connected: false,
        expired: false,
        ready: true,
        userinfos: undefined,
      });
    });
  });

  describe('fetchUserInfos', () => {
    it('should call get function with the endpoint', () => {
      // when
      Service.fetchUserInfos({
        endpoint: '/any-uersinfos-endpoint-mock',
        updateState: jest.fn(),
        validator: expect.any(Object),
      });

      // then
      expect(get).toHaveBeenCalledWith('/any-uersinfos-endpoint-mock');
    });

    it('should call handlers with update state callback', () => {
      // given
      const updateStateMock = jest.fn();
      const ValidatorMock = { validate: jest.fn(() => true) };
      const fetchUserInfosErrorHandlerMock = jest.spyOn(Service, 'fetchUserInfosErrorHandler');
      const fetchUserInfosSuccessHandlerMock = jest.spyOn(Service, 'fetchUserInfosSuccessHandler');

      // when
      Service.fetchUserInfos({
        endpoint: expect.any(String),
        updateState: updateStateMock,
        validator: ValidatorMock,
      });

      // then
      expect(fetchUserInfosErrorHandlerMock).toHaveBeenCalledWith(updateStateMock);
      expect(fetchUserInfosSuccessHandlerMock).toHaveBeenCalledWith(updateStateMock, ValidatorMock);
    });

    it('should call fetchUserInfosErrorHandler callback on error', async () => {
      // given
      const errorHandler = jest.fn();
      const updateStateMock = jest.fn();
      const error = new Error('Network error');
      jest.spyOn(Service, 'fetchUserInfosErrorHandler').mockReturnValueOnce(errorHandler);
      jest.mocked(get).mockRejectedValueOnce(error);

      // when
      await Service.fetchUserInfos({
        endpoint: '/any-uersinfos-endpoint-mock',
        updateState: updateStateMock,
        validator: expect.any(Object),
      });

      // then
      expect(get).toHaveBeenCalledWith('/any-uersinfos-endpoint-mock');
      expect(errorHandler).toHaveBeenCalledWith(error);
      expect(Service.fetchUserInfosErrorHandler).toHaveBeenCalledWith(updateStateMock);
    });

    it('should call fetchUserInfosSuccessHandler callback on success', async () => {
      // given
      const successHandler = jest.fn();
      const updateStateMock = jest.fn();
      const ValidatorMock = { validate: jest.fn(() => true) };
      const data = {
        firstname: 'any-firstname-mock',
        lastname: 'any-firstname-mock',
      };
      jest.spyOn(Service, 'fetchUserInfosSuccessHandler').mockReturnValueOnce(successHandler);
      jest.mocked(get).mockResolvedValueOnce({ data } as unknown as AxiosResponse);

      // when
      await Service.fetchUserInfos({
        endpoint: '/any-uersinfos-endpoint-mock',
        updateState: updateStateMock,
        validator: ValidatorMock,
      });

      // then
      expect(get).toHaveBeenCalledWith('/any-uersinfos-endpoint-mock');
      expect(successHandler).toHaveBeenCalledWith({
        data: {
          firstname: 'any-firstname-mock',
          lastname: 'any-firstname-mock',
        },
      });
      expect(Service.fetchUserInfosSuccessHandler).toHaveBeenCalledWith(
        updateStateMock,
        ValidatorMock,
      );
    });
  });
});
