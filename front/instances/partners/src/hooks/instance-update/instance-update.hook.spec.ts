import { renderHook } from '@testing-library/react';
import { useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';

import { InstancesService, type VersionInterface } from '@fc/core-partners';
import type { JSONFieldType } from '@fc/dto2form';
import type { HttpClientDataInterface } from '@fc/http-client';

import { useInstanceUpdate } from './instance-update.hook';

describe('useInstance', () => {
  // Given
  const navigateMock = jest.fn();
  const instanceIdMock = 'any-instanceId-mock';
  const paramsMock = { instanceId: instanceIdMock };
  const schemaMock = Symbol('schema-mock') as unknown as JSONFieldType[];
  const versionMock = Symbol('data-mock') as unknown as VersionInterface;
  const payloadMock = {
    name: 'any-name-mock',
    versions: [{ data: versionMock }],
  };

  beforeEach(() => {
    // Given
    jest.mocked(useNavigate).mockReturnValue(navigateMock);
    jest.mocked(useParams).mockReturnValue(paramsMock);
    jest.mocked(useLoaderData).mockReturnValue({ payload: payloadMock });
    jest.mocked(useRouteLoaderData).mockReturnValue(schemaMock);
  });

  it('should call hooks and return an object with initialValues, submitHandler, title, schema', () => {
    // When
    const { result } = renderHook(() => useInstanceUpdate());

    // Then
    expect(result.current).toStrictEqual({
      initialValues: versionMock,
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
      const submissionErrorsMock = [{ anyField: 'an-field-error' }];
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      jest.mocked(InstancesService.update).mockResolvedValueOnce({ payload: submissionErrorsMock });

      // When
      const { result } = renderHook(() => useInstanceUpdate());
      const errors = await result.current.submitHandler(dataMock);

      // Then
      expect(errors).toBe(submissionErrorsMock);
    });

    it('should return the generic form error when InstancesService.update response is not defined', async () => {
      // Given
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      jest.mocked(InstancesService.update).mockResolvedValueOnce(undefined);

      // When
      const { result } = renderHook(() => useInstanceUpdate());
      const errors = await result.current.submitHandler(dataMock);

      // Then
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect(errors).toStrictEqual({ 'FINAL_FORM/form-error': 'Form.FORM_ERROR' });
    });

    it('should call navigate if InstancesService.update with params is not returning any errors', async () => {
      // Given
      const dataMock = Symbol('data-mock') as unknown as HttpClientDataInterface;

      jest.mocked(InstancesService.update).mockResolvedValueOnce({ payload: undefined });

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
