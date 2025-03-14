import { render } from '@testing-library/react';
import { Outlet } from 'react-router-dom';

import { NoticeComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { PageLayout } from './page.layout';

describe('PageLayout', () => {
  it('should match snapshot', () => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('Partners.page.noticeTitle-mock')
      .mockReturnValueOnce('Partners.page.noticeDescription-mock');

    // When
    const { container } = render(<PageLayout />);

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.page.noticeTitle');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.page.noticeDescription');
    expect(Outlet).toHaveBeenCalledOnce();
    expect(Outlet).toHaveBeenCalledWith({}, {});
    expect(NoticeComponent).toHaveBeenCalledOnce();
    expect(NoticeComponent).toHaveBeenCalledWith(
      {
        description: 'Partners.page.noticeDescription-mock',
        title: 'Partners.page.noticeTitle-mock',
      },
      {},
    );
  });
});
