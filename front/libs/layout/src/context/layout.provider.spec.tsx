import { render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import { useSafeContext } from '@fc/common';

import { LayoutProvider } from './layout.provider';

describe('LayoutProvider', () => {
  beforeEach(() => {
    // Given
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
    // When
    const { container } = render(<LayoutProvider>Test</LayoutProvider>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useToggle with false as default value', () => {
    // When
    render(<LayoutProvider>Test</LayoutProvider>);

    // Then
    expect(useToggle).toHaveBeenCalledOnce();
    expect(useToggle).toHaveBeenCalledWith(false);
  });
});
