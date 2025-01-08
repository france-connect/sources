import { render } from '@testing-library/react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { RouterException } from '../../exceptions';
import { RouterErrorBoundaryComponent } from './router-error-boundary.component';

describe('RouterErrorBoundaryComponent', () => {
  it('should match the snapshot if is not a router error', () => {
    // Given
    const errorMock = new RouterException(new Error('any message mock'));
    jest.mocked(useRouteError).mockReturnValueOnce(errorMock);
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
    const errorMock = new RouterException(new Error('any message mock'));
    jest.mocked(useRouteError).mockReturnValueOnce(errorMock);
    jest.mocked(isRouteErrorResponse).mockReturnValueOnce(false);
    // @NOTE hide console.error logs into console
    // as the code below suposed to throw
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // When / then
    expect(() => {
      render(<RouterErrorBoundaryComponent />);
    }).toThrow();
  });
});
