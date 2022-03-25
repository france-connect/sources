import { render } from '@testing-library/react';
import { RiCheckLine, RiCloseLine, RiThumbDownFill, RiThumbUpFill } from 'react-icons/ri';

import { FieldSwitchToggleButtonComponent } from './field-switch-toggle-button.component';

describe('FieldSwitchToggleButtonComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with an aria-hidden attribute and classes', () => {
    // when
    const { container } = render(<FieldSwitchToggleButtonComponent checked={false} />);
    const element = container.firstChild;
    // then
    expect(element).toHaveAttribute('aria-hidden');
    expect(element).toHaveClass('FieldSwitchInputComponent-toggle-button');
    expect(element).toHaveClass('is-relative');
  });

  it('should render a thumb element with class', () => {
    // when
    const { container } = render(<FieldSwitchToggleButtonComponent checked={false} />);
    const element = container.firstChild?.firstChild;
    // then
    expect(element).toHaveClass('FieldSwitchInputComponent-toggle-thumb');
    expect(element).toHaveClass('is-absolute');
  });

  it('should render a icon element', () => {
    // when
    const { container } = render(<FieldSwitchToggleButtonComponent checked={false} />);
    const element = container.firstChild?.firstChild?.firstChild;
    // then
    expect(element).toHaveClass('FieldSwitchInputComponent-icon');
  });

  it('should render the checked icon', () => {
    // when
    render(<FieldSwitchToggleButtonComponent checked />);
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });

  it('should render the unchecked icon', () => {
    // when
    render(<FieldSwitchToggleButtonComponent checked={false} />);
    // then
    expect(RiCloseLine).toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });

  it('should render a custom checked icon', () => {
    // when
    render(
      <FieldSwitchToggleButtonComponent
        checked
        icons={{ active: RiThumbUpFill, inactive: RiThumbDownFill }}
      />,
    );
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });

  it('should render a custom unchecked icon', () => {
    // when
    render(
      <FieldSwitchToggleButtonComponent
        checked={false}
        icons={{ active: RiThumbUpFill, inactive: RiThumbDownFill }}
      />,
    );
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).toHaveBeenCalled();
  });

  it('should not render a checked icon, the icon is undefined', () => {
    // when
    render(
      <FieldSwitchToggleButtonComponent
        checked
        icons={{ active: undefined, inactive: RiThumbDownFill }}
      />,
    );
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });

  it('should not render a unchecked icon, the icon is undefined', () => {
    // when
    render(
      <FieldSwitchToggleButtonComponent
        checked={false}
        icons={{ active: RiThumbUpFill, inactive: undefined }}
      />,
    );
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });

  it('should not render ay icon, if icons are disabled', () => {
    // when
    render(<FieldSwitchToggleButtonComponent checked={false} icons={false} />);
    // then
    expect(RiCloseLine).not.toHaveBeenCalled();
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(RiThumbUpFill).not.toHaveBeenCalled();
    expect(RiThumbDownFill).not.toHaveBeenCalled();
  });
});
