import { render } from '@testing-library/react';

import { HomePage } from './home.page';

jest.mock('@fc/i18n');

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<HomePage />);

    // then
    expect(container).toMatchSnapshot();
  });
});
