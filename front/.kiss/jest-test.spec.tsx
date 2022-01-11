// @see _doc/jest.md
// import { mocked } from 'ts-jest/utils';
// import { renderWithRedux } from '../../testUtils';
import { render } from '@testing-library/react';

import MyModule from './my-module';

describe('MyModule', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render something', () => {
    // given
    const { getByText, debug } = render(<MyModule />);
    // when
    debug();
    const linkElement = getByText(/learn react/i);
    // then
    expect(linkElement).toBeInTheDocument();
  });
});
