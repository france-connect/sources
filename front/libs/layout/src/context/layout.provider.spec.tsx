import { render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import { useSafeContext } from '@fc/common';

import { LayoutProvider } from './layout.provider';

describe('LayoutProvider', () => {
  beforeEach(() => {
    // given
    jest.mocked(useSafeContext).mockReturnValue({
      connected: true,
      ready: true,
      userinfos: {
        firstname: 'any firstname mock',
        lastname: 'any lastname mock',
      },
    });
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutProvider>Test</LayoutProvider>);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call useToggle with false as default value', () => {
    // when
    render(<LayoutProvider>Test</LayoutProvider>);

    // then
    expect(useToggle).toHaveBeenCalledOnce();
    expect(useToggle).toHaveBeenCalledWith(false);
  });
});
