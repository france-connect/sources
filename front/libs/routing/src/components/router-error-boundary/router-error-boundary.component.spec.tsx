import { render } from '@testing-library/react';
import { isRouteErrorResponse, useRouteError } from 'react-router';

import { RouterException } from '../../exceptions';
import { RouterErrorBoundaryComponent } from './router-error-boundary.component';

describe('RouterErrorBoundaryComponent', () => {
  // Given
  const errorMock = new RouterException(new Error('any message mock'));

  beforeEach(() => {
    // Given
    jest.mocked(useRouteError).mockReturnValueOnce(errorMock);
    // @NOTE hide console.error logs into console
    // as the code below suposed to throw
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  it('should match the snapshot if is a router error', () => {
    jest.mocked(isRouteErrorResponse).mockReturnValueOnce(true);

    // When
    const { container } = render(<RouterErrorBoundaryComponent />);

    // Then
    expect(useRouteError).toHaveBeenCalledOnce();
    expect(isRouteErrorResponse).toHaveBeenCalledOnce();
    expect(isRouteErrorResponse).toHaveBeenCalledWith(errorMock);
    expect(container).toMatchSnapshot();
  });

  it('should throw an error if is not a router error', () => {
    // Given
    jest.mocked(isRouteErrorResponse).mockReturnValueOnce(false);

    // When / then
    expect(() => {
      render(<RouterErrorBoundaryComponent />);
    }).toThrow();
  });
});
