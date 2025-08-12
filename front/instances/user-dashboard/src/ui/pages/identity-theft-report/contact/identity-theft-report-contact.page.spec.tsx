import { render } from '@testing-library/react';
import { use } from 'react';

import { ConfigService } from '@fc/config';
import { StepperContext } from '@fc/dsfr';
import type { SchemaFieldType } from '@fc/dto2form';
import { useDto2Form } from '@fc/dto2form';

import { IdentityTheftReportContactPage } from './identity-theft-report-contact.page';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: jest.fn(),
}));

describe('IdentityTheftReportContactPage', () => {
  const useMock = jest.mocked(use);

  const configServiceMock = jest.mocked(ConfigService);
  const handleClickMock = jest.fn();

  const useDto2FormMock = jest.mocked(useDto2Form);
  const configMock = {
    IdentityTheftDescription: {},
  };

  const initialValuesMock = {};
  const schemaMock = [] as SchemaFieldType[];
  const submitHandlerMock = jest.fn();

  const useDto2FormResult = {
    initialValues: initialValuesMock,
    schema: schemaMock,
    submitHandler: submitHandlerMock,
  };

  beforeEach(() => {
    useMock.mockImplementation(() => ({
      gotoNextStep: handleClickMock,
    }));

    useDto2FormMock.mockReturnValue(useDto2FormResult);
    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportContactPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should get the configuration for Dto2Form', () => {
    // When
    render(<IdentityTheftReportContactPage />);

    // Then
    expect(ConfigService.get).toHaveBeenCalledExactlyOnceWith('Dto2Form');
  });

  it('should use StepperContext', () => {
    // When
    render(<IdentityTheftReportContactPage />);

    // Then
    expect(useMock).toHaveBeenCalledOnce();
    expect(useMock).toHaveBeenCalledWith(StepperContext);
  });
});
