import { render } from '@testing-library/react';

import { useSafeContext } from '@fc/common';
import { StepperContext } from '@fc/dsfr';
import type { SchemaFieldType } from '@fc/dto2form';
import { Dto2FormComponent, removeEmptyValues } from '@fc/dto2form';
import { useDto2FormService } from '@fc/dto2form-service';

import { IdentityTheftReportFormComponent } from './identity-theft-report.component';

describe('IdentityTheftReportFormComponent', () => {
  // Given
  const gotoNextMock = jest.fn();
  const initialValuesMock = {};
  const schemaMock = [] as SchemaFieldType[];
  const formMock = expect.any(Object);
  const submitHandlerMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useSafeContext).mockImplementation(() => ({
      gotoNextStep: gotoNextMock,
    }));
    jest.mocked(useDto2FormService).mockReturnValue({
      form: formMock,
      initialValues: initialValuesMock,
      schema: schemaMock,
      submitHandler: submitHandlerMock,
    });
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportFormComponent id="any-id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call StepperContext', () => {
    // When
    render(<IdentityTheftReportFormComponent id="any-id-mock" />);

    // Then
    expect(useSafeContext).toHaveBeenCalledOnce();
    expect(useSafeContext).toHaveBeenCalledWith(StepperContext);
  });

  it('should call useDto2FormService', () => {
    // When
    render(<IdentityTheftReportFormComponent id="any-id-mock" />);

    // Then
    expect(useDto2FormService).toHaveBeenCalledOnce();
    expect(useDto2FormService).toHaveBeenCalledWith('any-id-mock');
  });

  it('should call Dto2FormComponent with parameters', () => {
    // When
    render(<IdentityTheftReportFormComponent id="any-id-mock" />);

    // Then
    expect(Dto2FormComponent).toHaveBeenCalledOnce();
    expect(Dto2FormComponent).toHaveBeenCalledWith(
      {
        config: formMock,
        initialValues: initialValuesMock,
        onPostSubmit: gotoNextMock,
        onPreSubmit: removeEmptyValues,
        onSubmit: submitHandlerMock,
        schema: schemaMock,
      },
      undefined,
    );
  });
});
