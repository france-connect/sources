import { render } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { ServiceProviderHeaderComponent } from '../../../components';
import { ServiceProviderStatusColors } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';
import { ServiceProviderReadPage } from './service-provider-read.page';

jest.mock('react-router-dom');
jest.mock('../../../hooks/service-provider-details/service-provider-details.hook');
jest.mock('../../../components/service-provider-header/service-provider-header.component');

const itemMock = {
  color: ServiceProviderStatusColors.SANDBOX,
  platformName: 'chaine traduite',
  spName: 'name',
  status: 'chaine traduite',
};

describe('ServiceProviderReadPage', () => {
  beforeEach(() => {
    // given
    jest.mocked(useParams).mockReturnValueOnce({ id: '42' });
  });

  it('should match the snapshot', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    const { container } = render(<ServiceProviderReadPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call hook function useServiceProviderDetails', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProviderReadPage />);

    // then
    expect(useServiceProviderDetails).toHaveBeenCalledTimes(1);
  });

  it('should call ServiceProviderHeaderComponent when item is defined', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    render(<ServiceProviderReadPage />);

    // then
    expect(ServiceProviderHeaderComponent).toHaveBeenCalledTimes(1);
  });

  it('should not call ServiceProviderHeaderComponent when item is undefined', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProviderReadPage />);

    // then
    expect(ServiceProviderHeaderComponent).not.toHaveBeenCalled();
  });
});
