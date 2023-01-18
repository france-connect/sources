import { render } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import {
  ServiceProviderHeaderComponent,
  ServiceProviderSandboxComponent,
} from '../../../components';
import { ServiceProviderStatusColors } from '../../../enums';
import { useServiceProviderDetails } from '../../../hooks';
import { ServiceProviderUpdatePage } from './service-provider-update.page';

jest.mock('react-router-dom');
jest.mock('../../../hooks/service-provider-details/service-provider-details.hook');
jest.mock('../../../components/service-provider-header/service-provider-header.component');
jest.mock('../../../components/service-provider-sandbox/service-provider-sandbox.component');

const itemMock = {
  color: ServiceProviderStatusColors.SANDBOX,
  platformName: 'chaine traduite',
  spName: 'name',
  status: 'chaine traduite',
};

describe('ServiceProviderUpdatePage', () => {
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
    const { container } = render(<ServiceProviderUpdatePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call hook function useServiceProviderDetails', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: undefined,
    });

    // when
    render(<ServiceProviderUpdatePage />);

    // then
    expect(useServiceProviderDetails).toHaveBeenCalledTimes(1);
  });

  it('should call ServiceProviderHeaderComponent when item is defined', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    render(<ServiceProviderUpdatePage />);

    // then
    expect(ServiceProviderHeaderComponent).toHaveBeenCalledTimes(1);
  });

  it('should call ServiceProviderSandboxComponent', () => {
    // given
    jest.mocked(useServiceProviderDetails).mockReturnValueOnce({
      item: itemMock,
    });

    // when
    render(<ServiceProviderUpdatePage />);

    // then
    expect(ServiceProviderSandboxComponent).toHaveBeenCalledTimes(1);
  });
});
