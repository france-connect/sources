import { render } from '@testing-library/react';

import { HomePage } from './home.page';

jest.mock('@fc/i18n');
jest.mock('react-router-dom');

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
