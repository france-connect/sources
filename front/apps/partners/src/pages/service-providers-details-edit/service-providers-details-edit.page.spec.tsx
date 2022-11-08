import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useParams } from 'react-router-dom';

import { ServiceProvidersDetailsHeaderComponent } from '../../components/service-providers-details-header';
import { ServiceProviderStatusColors } from '../../enums';
import { useServiceProviderDetails } from '../../hooks';
import { ServiceProvidersDetailsEditPage } from './service-providers-details-edit.page';

jest.mock('react-router-dom');
jest.mock('../../hooks/service-provider-details.hook');
jest.mock(
  '../../components/service-providers-details-header/service-providers-details-header.component',
);

const itemMock = {
  color: ServiceProviderStatusColors.SANDBOX,
  platformName: 'chaine traduite',
  spName: 'name',
  status: 'chaine traduite',
};

describe('ServiceProvidersDetailsEditPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // given
    mocked(useParams).mockReturnValueOnce({ id: '42' });
  });

  it('should match the snapshot', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    const { container } = render(<ServiceProvidersDetailsEditPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should display details mode text', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    const { getByText } = render(<ServiceProvidersDetailsEditPage />);

    // then
    const element = getByText('Mode édition');

    expect(element).toBeInTheDocument();
  });

  it('should call hook function useServiceProviderDetails', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProvidersDetailsEditPage />);

    // then
    expect(useServiceProviderDetails).toHaveBeenCalledTimes(1);
  });

  it('should call ServiceProvidersDetailsHeaderComponent when item is defined', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    render(<ServiceProvidersDetailsEditPage />);

    // then
    expect(ServiceProvidersDetailsHeaderComponent).toHaveBeenCalledTimes(1);
  });

  it('should not call ServiceProvidersDetailsHeaderComponent when item is undefined', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProvidersDetailsEditPage />);

    // then
    expect(ServiceProvidersDetailsHeaderComponent).not.toHaveBeenCalled();
  });
});
