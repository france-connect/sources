import { render } from '@testing-library/react';
import React from 'react';

import { ErrorGenericComponent } from './error-generic.component';

describe('ErrorGenericComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ErrorGenericComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
