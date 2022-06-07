import { render } from '@testing-library/react';

import { HomePage } from './home.page';

describe('HomePage', () => {
  beforeEach(() => {});

  it('should match the snapshot', () => {
    // when
    const { container } = render(<HomePage />);
    // then
    expect(container).toMatchSnapshot();
  });
});
