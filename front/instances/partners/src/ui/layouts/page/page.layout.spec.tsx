import { render } from '@testing-library/react';
import type { PathMatch } from 'react-router';
import { Outlet, useMatch } from 'react-router';

import { MessageTypes } from '@fc/common';
import { NoticeComponent } from '@fc/dsfr';

import { PageLayout } from './page.layout';

describe('PageLayout', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<PageLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call Outlet component', () => {
    // When
    render(<PageLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledExactlyOnceWith({}, undefined);
  });

  it('should call NoticeComponent with arguments, when url is not service provider page', () => {
    // Given
    jest.mocked(useMatch).mockReturnValueOnce(null);

    // When
    render(<PageLayout />);

    // Then
    expect(NoticeComponent).toHaveBeenCalledExactlyOnceWith(
      {
        description: 'Partners.layout.noticeDescription',
        title: 'Partners.layout.noticeTitle',
      },
      undefined,
    );
  });

  // @TODO to be removed with next BDD update
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2625
  it('should call NoticeComponent with arguments, when url is service provider page', () => {
    // Given
    jest.mocked(useMatch).mockReturnValueOnce({} as PathMatch<string>);

    // When
    render(<PageLayout />);

    // Then
    expect(NoticeComponent).toHaveBeenCalledExactlyOnceWith(
      {
        description: 'Partners.layout.serviceProvidersNoticeDescription',
        title: 'Partners.layout.serviceProvidersNoticeTitle',
        type: MessageTypes.WARNING,
      },
      undefined,
    );
  });

  // @TODO to be removed with next BDD update
  // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2625
  it('should useMatch with path /fournisseurs-de-service', () => {
    // When
    render(<PageLayout />);

    // Then
    expect(useMatch).toHaveBeenCalledExactlyOnceWith(
      {
        path: '/fournisseurs-de-service',
      },
      undefined,
    );
  });
});
