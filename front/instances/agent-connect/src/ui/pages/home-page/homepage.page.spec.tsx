import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { LinkComponent, Sizes } from '@fc/dsfr';

import {
  SearchComponent,
  ServiceProviderNameComponent,
  UserHistoryComponent,
} from '../../components';
import { HomePage } from './homepage.page';

jest.mock('@fc/dsfr');
jest.mock('../../components/search/search.component');
jest.mock('../../components/user-history/user-history.component');
jest.mock('../../components/service-provider-name/service-provider-name.component');

describe('HomePage', () => {
  it('should math the snapshot, in a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should math the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call a LinkComponent with params', () => {
    // when
    render(<HomePage />);

    // then
    expect(LinkComponent).toHaveBeenCalledTimes(1);
    expect(LinkComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://agentconnect.gouv.fr/aide',
        icon: 'question-fill',
        label: 'J’ai besoin d’aide',
        size: Sizes.LARGE,
      }),
      {},
    );
  });

  it('should call ServiceProviderNameComponent', () => {
    // when
    render(<HomePage />);

    // then
    expect(ServiceProviderNameComponent).toHaveBeenCalled();
  });

  it('should call UserHistoryComponent', () => {
    // when
    render(<HomePage />);

    // then
    expect(UserHistoryComponent).toHaveBeenCalled();
  });

  it('should call SearchComponent', () => {
    // when
    render(<HomePage />);

    // then
    expect(SearchComponent).toHaveBeenCalled();
  });
});
