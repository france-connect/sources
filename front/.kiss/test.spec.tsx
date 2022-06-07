// @see _doc/jest.md
import { render } from '@testing-library/react';

import { MyModule } from './my-module';

describe('MyModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<MyModule />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should render something', () => {
    // given
    // when
    const { getByText, debug } = render(<MyModule />);
    const linkElement = getByText(/learn react/i);
    // then
    debug();
    expect(linkElement).toBeInTheDocument();
  });
});
