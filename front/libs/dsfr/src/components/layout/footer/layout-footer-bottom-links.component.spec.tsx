import { render } from '@testing-library/react';

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
});
