import { render } from '@testing-library/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AccountContext, AccountInterface } from '@fc/account';

import { ServiceProvidersListComponent } from '../../components/service-providers-list';
import { ServiceProvidersPageTitleComponent } from '../../components/service-providers-page-title';
import { ServiceProvidersPage } from './service-providers.page';

jest.mock('react-redux');
jest.mock('@fc/partners');
jest.mock('../../components/service-providers-list/service-providers-list.component');
jest.mock('../../components/service-providers-page-title/service-providers-page-title.component');

describe('ServiceProvidersPage', () => {
  const accountContextMock = {
    connected: true,
  } as unknown as AccountInterface;

  beforeEach(() => {
    jest.mocked(useDispatch).mockReturnValueOnce(jest.fn());
  });

  it('should match the snapshot when user is connected', () => {
    // given
    jest.mocked(useSelector).mockReturnValueOnce({ items: [], totalItems: 0 });

    // when
    const { container } = render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when user is not connected', () => {
    // given
    jest.mocked(useSelector).mockReturnValueOnce({ items: [], totalItems: 0 });

    // when
    const { container } = render(
      <AccountContext.Provider value={{ ...accountContextMock, connected: false }}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call ServiceProvidersPageTitleComponent', () => {
    // given
    const totalItems = 3;
    const items = [expect.any(Object), expect.any(Object), expect.any(Object)];
    jest.mocked(useSelector).mockReturnValue({ items, totalItems });

    // when
    render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(ServiceProvidersPageTitleComponent).toHaveBeenCalledTimes(1);
    expect(ServiceProvidersPageTitleComponent).toHaveBeenCalledWith({ totalItems: 3 }, {});
  });

  it('should call ServiceProvidersListComponent with params', () => {
    // given
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: true });
    const totalItems = 3;
    const items = [expect.any(Object), expect.any(Object), expect.any(Object)];
    jest.mocked(useSelector).mockReturnValue({ items, totalItems });

    // when
    render(
      <AccountContext.Provider value={accountContextMock}>
        <ServiceProvidersPage />
      </AccountContext.Provider>,
    );

    // then
    expect(ServiceProvidersListComponent).toHaveBeenCalledTimes(1);
    expect(ServiceProvidersListComponent).toHaveBeenCalledWith(
      {
        items,
        totalItems,
      },
      {},
    );
  });
});
