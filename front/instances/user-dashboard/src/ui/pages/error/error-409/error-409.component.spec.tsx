import { render } from '@testing-library/react';

import { Error409Component } from './error-409.component';

describe('Error409Component', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<Error409Component />);

    // then
    expect(container).toMatchSnapshot();
  });
});
