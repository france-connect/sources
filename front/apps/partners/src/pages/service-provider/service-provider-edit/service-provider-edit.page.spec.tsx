import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useParams } from 'react-router-dom';

import { ServiceProviderHeaderComponent } from '../../../components/service-provider-header';
import { ServiceProviderStatusColors } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';
import { ServiceProviderEditPage } from './service-provider-edit.page';

jest.mock('react-router-dom');
jest.mock('../../../hooks/service-provider-details.hook');
jest.mock('../../../components/service-provider-header/service-provider-header.component');

const itemMock = {
  color: ServiceProviderStatusColors.SANDBOX,
  platformName: 'chaine traduite',
  spName: 'name',
  status: 'chaine traduite',
};

describe('ServiceProviderEditPage', () => {
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
    const { container } = render(<ServiceProviderEditPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should display details mode text', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    const { getByText } = render(<ServiceProviderEditPage />);

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
    render(<ServiceProviderEditPage />);

    // then
    expect(useServiceProviderDetails).toHaveBeenCalledTimes(1);
  });

  it('should call ServiceProviderHeaderComponent when item is defined', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    render(<ServiceProviderEditPage />);

    // then
    expect(ServiceProviderHeaderComponent).toHaveBeenCalledTimes(1);
  });

  it('should not call ServiceProviderHeaderComponent when item is undefined', () => {
    // given
    mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProviderEditPage />);

    // then
    expect(ServiceProviderHeaderComponent).not.toHaveBeenCalled();
  });
});
