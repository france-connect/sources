import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { ErrorComponent } from './error.component';
import { AGENT_NOT_FOUND_ERROR_CODE, ErrorPage } from './error.page';
import { NotFoundComponent } from './not-found.component';
import { PublicnessErrorComponent } from './publicness-error.component';

jest.mock('./error.component');
jest.mock('./not-found.component');
jest.mock('./publicness-error.component');

describe('ErrorPage', () => {
  it('should match the snapshot, in a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<ErrorPage />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);

    // when
    const { container } = render(<ErrorPage />);

    // then
    expect(container).toMatchSnapshot();
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

  it('should render the PublicnessErrorComponent when window.appError.code is AGENT_NOT_FOUND_ERROR_CODE', () => {
    // given
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).appError = { code: AGENT_NOT_FOUND_ERROR_CODE };

    // when
    render(<ErrorPage />);

    // then
    // then
    expect(PublicnessErrorComponent).toHaveBeenCalledTimes(1);
  });
});
