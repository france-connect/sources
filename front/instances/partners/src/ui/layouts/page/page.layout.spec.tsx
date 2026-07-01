import { render } from '@testing-library/react';
import { Outlet } from 'react-router';

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

  it('should call NoticeComponent with arguments', () => {
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
});
