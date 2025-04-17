import { renderHook } from '@testing-library/react';
import { useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';

import type { VersionInterface } from '@fc/core-partners';
import { parseInitialValues, type SchemaFieldType } from '@fc/dto2form';
import type { HttpClientDataInterface } from '@fc/http-client';

import { InstancesService } from '../../services';
import { useInstanceUpdate } from './instance-update.hook';

// Given
jest.mock('./../../services');

describe('useInstanceUpdate', () => {
  // Given
  const navigateMock = jest.fn();
  const instanceIdMock = 'any-instanceId-mock';
  const paramsMock = { instanceId: instanceIdMock };
  const schemaMock = Symbol('schema-mock') as unknown as SchemaFieldType[];
  const versionMock = { name: 'any-name-mock' } as unknown as VersionInterface;
  const payloadMock = {
    versions: [{ data: versionMock }],
  };
  const initialValuesMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'any-name-mock-1': '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'any-name-mock-2': [''],
  };

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useParams).mockReturnValue(paramsMock);
    jest.mocked(useLoaderData).mockReturnValue({ payload: payloadMock });
    jest.mocked(useRouteLoaderData).mockReturnValue(schemaMock);
    jest.mocked(parseInitialValues).mockReturnValue(initialValuesMock);
  });

  it('should call hooks and return an object with initialValues, submitHandler, title, schema', () => {
    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual({
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: expect.any(Function),
      title: 'any-name-mock',
    });
    expect(useNavigate).toHaveBeenCalledOnce();
    expect(useNavigate).toHaveBeenCalledWith();
    expect(useParams).toHaveBeenCalledOnce();
    expect(useParams).toHaveBeenCalledWith();
    expect(useLoaderData).toHaveBeenCalledOnce();
    expect(useLoaderData).toHaveBeenCalledWith();
    expect(useRouteLoaderData).toHaveBeenCalledOnce();
    expect(useRouteLoaderData).toHaveBeenCalledWith('dto2form::version::shema');
  });

  it('should return an undefined title and empty object for initialValues, if response.payload is undefined', () => {
    // Given
    jest.mocked(parseInitialValues).mockReturnValue({});
    jest.mocked(useLoaderData).mockReturnValue({ payload: null });

    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual({
      initialValues: {},
      schema: schemaMock,
      submitHandler: expect.any(Function),
      title: undefined,
    });
    expect(useNavigate).toHaveBeenCalledOnce();
    expect(useNavigate).toHaveBeenCalledWith();
    expect(useParams).toHaveBeenCalledOnce();
    expect(useParams).toHaveBeenCalledWith();
    expect(useLoaderData).toHaveBeenCalledOnce();
    expect(useLoaderData).toHaveBeenCalledWith();
    expect(useRouteLoaderData).toHaveBeenCalledOnce();
    expect(useRouteLoaderData).toHaveBeenCalledWith('dto2form::version::shema');
  });

  describe('Submit function', () => {
    it('should call InstancesService.update with data when submit is called', async () => {
      // Given
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      // When
      const { result } = renderHook(() => useInstanceUpdate());
      await result.current.submitHandler(dataMock);

      // Then
      expect(InstancesService.update).toHaveBeenCalledOnce();
      expect(InstancesService.update).toHaveBeenCalledWith(dataMock, 'any-instanceId-mock');
    });

    it('should return some submission errors from InstancesService.update response', async () => {
      // Given
      const submissionErrorsMock = {
        anyFieldMock1: ['an-field-error-1'],
        anyFieldMock2: 'an-field-error-2',
        anyFieldMock3: 'an-field-error-3',
      };
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      jest.mocked(InstancesService.update).mockResolvedValueOnce(submissionErrorsMock);

      // When
      const { result } = renderHook(() => useInstanceUpdate());
      const errors = await result.current.submitHandler(dataMock);

      // Then
      expect(errors).toStrictEqual({
        anyFieldMock1: ['an-field-error-1'],
        anyFieldMock2: 'an-field-error-2',
        anyFieldMock3: 'an-field-error-3',
      });
    });

    it('should call navigate if InstancesService.update with params is not returning any errors', async () => {
      // Given
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      jest.mocked(InstancesService.update).mockResolvedValueOnce(undefined);

      // When
      const { result } = renderHook(() => useInstanceUpdate());
      const errors = await result.current.submitHandler(dataMock);

      // Then
      expect(navigateMock).toHaveBeenCalledOnce();
      expect(navigateMock).toHaveBeenCalledWith('..', {
        replace: true,
        state: {
          submitState: {
            message: 'Partners.instance.successUpdate',
            type: 'success',
          },
        },
      });
      expect(errors).toBeNull();
    });
  });
});
