import { render } from '@testing-library/react';

import { ErrorGenericComponent } from './error-generic.component';

describe('ErrorGenericComponent', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<ErrorGenericComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
