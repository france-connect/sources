import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { PublicnessErrorComponent } from './publicness-error.component';

describe('PublicnessErrorComponent', () => {
  it('should have call useMediaQuery with params', () => {
    // when
    render(<PublicnessErrorComponent />);

    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should match the snapshot for a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<PublicnessErrorComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<PublicnessErrorComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
