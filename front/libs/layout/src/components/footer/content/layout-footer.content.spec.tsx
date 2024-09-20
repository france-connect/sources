import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { LayoutFooterContentComponent } from './layout-footer.content';

describe('LayoutFooterContentComponent', () => {
  // given
  const navigationMock = [
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
  ];

  beforeEach(() => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      footer: {
        description: undefined,
        links: navigationMock,
      },
    });
  });

  it('should call ConfigService.get with Layout config name', () => {
    // when
    render(<LayoutFooterContentComponent />);

    // then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith('Layout');
  });

  it('should match the snapshot when description and links are defined', async () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      footer: {
        description: 'any description mock',
        links: navigationMock,
      },
    });

    // when
    const { container, findAllByRole, getByTitle } = render(<LayoutFooterContentComponent />);
    const elementLinks = await findAllByRole('link');
    const elementLink1 = getByTitle('any-title-mock-1');
    const elementLink2 = getByTitle('any-title-mock-2');

    // then
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('any description mock');
    expect(elementLinks).toHaveLength(2);
    expect(elementLink1).toBeInTheDocument();
    expect(elementLink1).toHaveAttribute('href', 'any-href-mock-1');
    expect(elementLink1).toHaveAttribute('title', 'any-title-mock-1');
    expect(elementLink1).not.toHaveAttribute('rel');
    expect(elementLink1).not.toHaveAttribute('target');
    expect(elementLink1).toHaveTextContent('any-label-mock-1');
    expect(elementLink2).toBeInTheDocument();
    expect(elementLink2).toHaveAttribute('href', 'any-href-mock-2');
    expect(elementLink2).toHaveAttribute('title', 'any-title-mock-2');
    expect(elementLink2).not.toHaveAttribute('rel');
    expect(elementLink2).not.toHaveAttribute('target');
    expect(elementLink2).toHaveTextContent('any-label-mock-2');
  });

  it('should match the snapshot when showIcon is true', async () => {
    // given
    jest.mocked(ConfigService.get).mockReturnValue({
      footer: {
        description: 'any description mock',
        links: navigationMock,
      },
    });

    // when
    const { container, findAllByRole, getByTitle } = render(
      <LayoutFooterContentComponent showIcon />,
    );
    const elementLinks = await findAllByRole('link');
    const elementLink1 = getByTitle('any-title-mock-1');
    const elementLink2 = getByTitle('any-title-mock-2');

    // then
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('any description mock');
    expect(elementLinks).toHaveLength(2);
    expect(elementLink1).toBeInTheDocument();
    expect(elementLink1).toHaveAttribute('href', 'any-href-mock-1');
    expect(elementLink1).toHaveAttribute('title', 'any-title-mock-1');
    expect(elementLink1).toHaveAttribute('target', '_blank');
    expect(elementLink1).toHaveAttribute('rel', 'noreferrer');
    expect(elementLink1).toHaveTextContent('any-label-mock-1');
    expect(elementLink2).toBeInTheDocument();
    expect(elementLink2).toHaveAttribute('href', 'any-href-mock-2');
    expect(elementLink2).toHaveAttribute('title', 'any-title-mock-2');
    expect(elementLink2).toHaveAttribute('target', '_blank');
    expect(elementLink2).toHaveAttribute('rel', 'noreferrer');
    expect(elementLink2).toHaveTextContent('any-label-mock-2');
  });
});
