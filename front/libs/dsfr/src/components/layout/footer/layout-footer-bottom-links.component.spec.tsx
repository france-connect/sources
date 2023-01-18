import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { LayoutFooterBottomLinksComponent } from './layout-footer-bottom-links.component';

describe('LayoutFooterBottomLinksComponent', () => {
  // given
  const itemsMock = [
    {
      a11y: 'any-a11y-mock-1',
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
    },
    {
      a11y: 'any-a11y-mock-2',
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
    },
    {
      a11y: 'any-a11y-mock-3',
      href: 'any-href-mock-3',
      label: 'any-label-mock-3',
    },
  ];

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutFooterBottomLinksComponent items={itemsMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call react router Link component 3 times', () => {
    // when
    render(<LayoutFooterBottomLinksComponent items={itemsMock} />);

    // then
    expect(Link).toHaveBeenCalledTimes(3);
    expect(Link).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        children: itemsMock[0].label,
        title: itemsMock[0].a11y,
        to: itemsMock[0].href,
      }),
      {},
    );
    expect(Link).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        children: itemsMock[1].label,
        title: itemsMock[1].a11y,
        to: itemsMock[1].href,
      }),
      {},
    );
    expect(Link).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        children: itemsMock[2].label,
        title: itemsMock[2].a11y,
        to: itemsMock[2].href,
      }),
      {},
    );
  });
});
