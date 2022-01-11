import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonLoadComponent } from './button-load.component';

describe('ButtonLoadComponent', () => {
  const onClickMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('should render ButtonLoadComponent', () => {
    // setup
    const { getByText } = render(<ButtonLoadComponent onClick={onClickMock} />);
    // action
    const label = getByText('LOAD SOMETHING');
    // expect
    expect(label).toBeInTheDocument();
  });

  it('should call oinClick handler when clicked', () => {
    // setup
    render(<ButtonLoadComponent onClick={onClickMock} />);
    // action
    userEvent.click(screen.getByText('LOAD SOMETHING'));
    // expect
    expect(onClickMock).toHaveBeenCalled();
  });
});
