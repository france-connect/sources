import { render } from '@testing-library/react';

import { NotFoundPage } from './not-found.page';

describe('NotFoundPage', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<NotFoundPage />);

    // then
    expect(container).toMatchSnapshot();
  });
});
