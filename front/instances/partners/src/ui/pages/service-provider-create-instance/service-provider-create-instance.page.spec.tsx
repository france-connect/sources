import { render } from '@testing-library/react';

import { InstancePageFormComponent, InstancePageHeaderComponent } from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useServiceProviderCreateInstance } from '../../../hooks';
import { ServiceProviderCreateInstancePage } from './service-provider-create-instance.page';

jest.mock('../../../hooks/service-provider-create-instance/service-provider-create-instance.hook');

describe('ServiceProviderCreateInstancePage', () => {
  // Given
  const useServiceProviderCreateInstanceResultMock = {
    config: expect.any(Object),
    initialValues: expect.any(Object),
    postSubmit: expect.any(Function),
    preSubmit: expect.any(Function),
    schema: expect.any(Object),
    submitHandler: expect.any(Function),
  };

  beforeEach(() => {
    // Given
    jest
      .mocked(useServiceProviderCreateInstance)
      .mockReturnValue(useServiceProviderCreateInstanceResultMock);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServiceProviderCreateInstancePage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the useServiceProviderCreateInstance hook', () => {
    // When
    render(<ServiceProviderCreateInstancePage />);

    // Then
    expect(useServiceProviderCreateInstance).toHaveBeenCalledOnce();
    expect(useServiceProviderCreateInstance).toHaveBeenCalledWith();
  });

  it('should call translations', () => {
    render(<ServiceProviderCreateInstancePage />);

    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.serviceProvider.createInstance.title');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.serviceProvider.createInstance.description');
  });

  it('should render InstancePageHeaderComponent with parameters', () => {
    // When
    render(<ServiceProviderCreateInstancePage />);

    // Then
    expect(InstancePageHeaderComponent).toHaveBeenCalledOnce();
    expect(InstancePageHeaderComponent).toHaveBeenCalledWith(
      {
        intro: 'Partners.serviceProvider.createInstance.description',
        title: 'Partners.serviceProvider.createInstance.title',
      },
      undefined,
    );
  });

  it('should render InstancePageFormComponent with parameters', () => {
    // When
    render(<ServiceProviderCreateInstancePage />);

    // Then
    expect(InstancePageFormComponent).toHaveBeenCalledOnce();
    expect(InstancePageFormComponent).toHaveBeenCalledWith(
      {
        config: useServiceProviderCreateInstanceResultMock.config,
        initialValues: useServiceProviderCreateInstanceResultMock.initialValues,
        postSubmit: useServiceProviderCreateInstanceResultMock.postSubmit,
        preSubmit: useServiceProviderCreateInstanceResultMock.preSubmit,
        schema: useServiceProviderCreateInstanceResultMock.schema,
        submitHandler: useServiceProviderCreateInstanceResultMock.submitHandler,
      },
      undefined,
    );
  });
});
