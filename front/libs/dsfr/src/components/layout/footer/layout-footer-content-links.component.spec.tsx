import { render } from '@testing-library/react';

import { LayoutFooterContentLinksComponent } from './layout-footer-content-links.component';

describe('LayoutFooterContentLinksComponent', () => {
  // given
  const itemsMock = [
    {
      href: 'any-href-mock-1',
      label: 'any-label-mock-1',
      title: 'any-title-mock-1',
    },
    {
      href: 'any-href-mock-2',
      label: 'any-label-mock-2',
      title: 'any-title-mock-2',
    },
    {
      href: 'any-href-mock-3',
      label: 'any-label-mock-3',
      title: 'any-title-mock-3',
    },
  ];

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutFooterContentLinksComponent items={itemsMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when title is missing', () => {
    // when
    const { container } = render(
      <LayoutFooterContentLinksComponent
        items={[
          {
            href: 'any-href-mock-without-title',
            label: 'any-label-mock-without-title',
          },
        ]}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when showIcon is defined', () => {
    // when
    const { container } = render(<LayoutFooterContentLinksComponent showIcon items={itemsMock} />);

    // then
    expect(container).toMatchSnapshot();
  });
});
