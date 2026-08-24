import { render } from '@testing-library/react';

import { InstancePageFormComponent } from '@fc/core-partners';
import { t } from '@fc/i18n';

import { useServiceProviderCreateContributor } from '../../../hooks';
import { ServiceProviderCreateContributorPage } from './service-provider-create-contributor.page';

jest.mock(
  '../../../hooks/service-provider-create-contributor/service-provider-create-contributor.hook',
);

describe('ServiceProviderCreateContributorPage', () => {
  // Given
  const UseCreateContributorResultMock = {
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

      .mocked(useServiceProviderCreateContributor)
      .mockReturnValue(UseCreateContributorResultMock);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServiceProviderCreateContributorPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the useServiceProviderCreateContributor hook', () => {
    // When
    render(<ServiceProviderCreateContributorPage />);

    // Then
    expect(useServiceProviderCreateContributor).toHaveBeenCalledOnce();
    expect(useServiceProviderCreateContributor).toHaveBeenCalledWith();
  });

  it('should call translations', () => {
    // When
    render(<ServiceProviderCreateContributorPage />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith(
      'Partners.serviceProviderPage.usersSection.contributorCreate.title',
    );
  });

  it('should render InstancePageFormComponent with parameters', () => {
    // When
    render(<ServiceProviderCreateContributorPage />);

    // Then
    expect(InstancePageFormComponent).toHaveBeenCalledOnce();
    expect(InstancePageFormComponent).toHaveBeenCalledWith(
      {
        config: UseCreateContributorResultMock.config,
        initialValues: UseCreateContributorResultMock.initialValues,
        postSubmit: UseCreateContributorResultMock.postSubmit,
        preSubmit: UseCreateContributorResultMock.preSubmit,
        schema: UseCreateContributorResultMock.schema,
        submitHandler: UseCreateContributorResultMock.submitHandler,
      },
      undefined,
    );
  });
});
