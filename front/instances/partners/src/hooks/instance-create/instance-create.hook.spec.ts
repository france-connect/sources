import { renderHook } from '@testing-library/react';

import { MessageTypes } from '@fc/common';
import { removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';

import { SubmitTypesMessage } from '../../enums';
import { usePostSubmit } from '../post-submit';
import { useInstanceCreate } from './instance-create.hook';

jest.mock('../post-submit/post-submit.hook');

describe('useInstanceCreate', () => {
  // Given
  const postSubmitMock = expect.any(Function);
  const UseDto2FormServiceResult = {
    form: expect.any(Object),
    initialValues: expect.any(Object),
    schema: expect.any(Object),
    submitHandler: expect.any(Function),
  };

  beforeEach(() => {
    // Given
    jest.mocked(usePostSubmit).mockReturnValue(postSubmitMock);
    jest.mocked(useDto2FormService).mockReturnValue(UseDto2FormServiceResult);
  });

  it('should call useDto2FormService with parameter', () => {
    // When
    renderHook(() => useInstanceCreate());

    // Then
    expect(useDto2FormService).toHaveBeenCalledOnce();
    expect(useDto2FormService).toHaveBeenCalledWith('InstancesCreate');
  });

  it('should call usePostSubmit with parameter', () => {
    // When
    renderHook(() => useInstanceCreate());

    // Then
    expect(usePostSubmit).toHaveBeenCalledOnce();
    expect(usePostSubmit).toHaveBeenCalledWith(
      SubmitTypesMessage.INSTANCE_SUCCESS_CREATE,
      MessageTypes.SUCCESS,
    );
  });

  it('should return the correct configuration', () => {
    // Given
    const { result } = renderHook(() => useInstanceCreate());

    // When
    const { config, initialValues, postSubmit, preSubmit, schema, submitHandler } = result.current;

    // Then
    expect(config).toBeDefined();
    expect(initialValues).toBeDefined();
    expect(postSubmit).toBeDefined();
    expect(preSubmit).toBe(removeEmptyValues);
    expect(schema).toBeDefined();
    expect(submitHandler).toBeDefined();
  });
});
