import { render } from '@testing-library/react';

import { ErrorBoundaryComponent } from './error-boundary.component';

describe('ErrorBoundaryComponent', () => {
  // given
  let consoleErrorMock: jest.SpyInstance;

  const TheErroredChildren = () => {
    throw new Error('Error');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // @NOTE by implementation ErrorBoundaryComponent is throwing errors
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // @NOTE by implementation ErrorBoundaryComponent is throwing errors
    consoleErrorMock.mockRestore();
  });

  it('should render the children, when no errors are thrown by any nested component', () => {
    // when
    const { getByText } = render(
      <ErrorBoundaryComponent>
        <div>the children component</div>
      </ErrorBoundaryComponent>,
    );
    const element = getByText('the children component');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should not render the children, when an error is thrown by any nested component', () => {
    // when
    const { getByText } = render(
      <ErrorBoundaryComponent>
        <div>the children component</div>
        <TheErroredChildren />
      </ErrorBoundaryComponent>,
    );
    const element = getByText('ErrorBoundaryComponent: Something went wrong.');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should call onError callback when an error is thrown by any nested component', () => {
    // given
    const onErrorMock = jest.fn();

    // when
    render(
      <ErrorBoundaryComponent onError={onErrorMock}>
        <div>the children component</div>
        <TheErroredChildren />
      </ErrorBoundaryComponent>,
    );

    // then
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
});
