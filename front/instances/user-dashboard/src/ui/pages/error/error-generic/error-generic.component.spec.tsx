import { render } from '@testing-library/react';

import { ErrorGenericComponent } from './error-generic.component';

describe('ErrorGenericComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<ErrorGenericComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
