import { render } from '@testing-library/react';

import { ErrorComponent } from './error.component';
import { ErrorPage } from './error.page';
import { NotFoundComponent } from './not-found.component';

jest.mock('./error.component');
jest.mock('./not-found.component');

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the NotFoundComponent when window.appError is undefined', () => {
    // when
    render(<ErrorPage />);
    // then
    expect(NotFoundComponent).toHaveBeenCalledTimes(1);
  });

  it('should render the ErrorComponent when window.appError is defined', () => {
    // given
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).appError = 'something';
    // when
    render(<ErrorPage />);
    // then
    expect(ErrorComponent).toHaveBeenCalledTimes(1);
    expect(ErrorComponent).toHaveBeenCalledWith({ errors: 'something' }, {});
  });
});
