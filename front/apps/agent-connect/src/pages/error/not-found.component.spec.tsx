import { render } from '@testing-library/react';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the H1 element with a text-center class', () => {
    // given
    const { getByText } = render(<NotFoundComponent />);
    // when
    const element = getByText('404 - Not Found');
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName).toStrictEqual('H1');
    expect(element).toHaveClass('text-center');
  });
});
