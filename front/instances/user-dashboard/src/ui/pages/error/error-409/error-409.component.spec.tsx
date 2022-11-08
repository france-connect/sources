import { render } from '@testing-library/react';
import React from 'react';

import { Error409Component } from './error-409.component';

describe('Error409Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<Error409Component />);

    // then
    expect(container).toMatchSnapshot();
  });
});
