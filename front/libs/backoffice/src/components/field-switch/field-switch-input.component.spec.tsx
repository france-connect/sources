import { render } from '@testing-library/react';

import { FieldSwitchInputComponent } from './field-switch-input.component';
import { FieldSwitchLabelComponent } from './field-switch-label.component';
import { FieldSwitchLegendComponent } from './field-switch-legend.component';

jest.mock('./field-switch-label.component');
jest.mock('./field-switch-legend.component');

describe('FieldSwitchInputComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render FieldSwitchInputComponent with className', () => {
    // when
    const { container } = render(
      <FieldSwitchInputComponent
        disabled
        rtl
        className="custom-class-mock"
        input={{
          checked: true,
          name: '',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: '',
        }}
        label="any-label"
        legend={{ active: '', inactive: '' }}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('FieldSwitchInputComponent');
    expect(element).toHaveClass('is-relative');
    expect(element).toHaveClass('custom-class-mock');
    expect(element).toHaveClass('checked');
    expect(element).toHaveClass('disabled');
    expect(element).toHaveClass('rtl');
  });

  it('should render FieldSwitchInputComponent with no css state classes', () => {
    // when
    const { container } = render(
      <FieldSwitchInputComponent
        className="any-classname"
        disabled={false}
        input={{
          checked: false,
          name: '',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: '',
        }}
        label="any-label"
        legend={{ active: '', inactive: '' }}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).not.toHaveClass('checked');
    expect(element).not.toHaveClass('disabled');
    expect(element).not.toHaveClass('rtl');
  });

  it('should render an input element into FieldSwitchInputComponent with structurals css classes and default attributes', () => {
    // when
    const { getByTestId } = render(
      <FieldSwitchInputComponent
        className="any-classname"
        disabled={false}
        input={{
          checked: false,
          name: 'input-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: undefined,
        }}
        label="any-label"
        legend={{ active: 'checked-legend', inactive: 'unchecked-legend' }}
      />,
    );
    const element = getByTestId('field-switch-input');
    // then
    expect(element).toHaveClass('is-absolute');
    expect(element).toHaveClass('opacity-0');
    expect(element).toHaveAttribute('id', 'input-name-mock');
    expect(element).toHaveAttribute('name', 'input-name-mock');
  });

  it('should render an input element into FieldSwitchInputComponent without disabled and checked attributes', () => {
    // when
    const { getByTestId } = render(
      <FieldSwitchInputComponent
        className="any-classname"
        disabled={false}
        input={{
          checked: false,
          name: 'input-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: '',
        }}
        label="any-label"
        legend={{ active: '', inactive: '' }}
      />,
    );
    const element = getByTestId('field-switch-input');
    // then
    expect(element).not.toHaveAttribute('checked');
    expect(element).not.toHaveAttribute('disabled');
  });

  it('should render an input element into FieldSwitchInputComponent with disabled and checked attributes', () => {
    // when
    const { getByTestId } = render(
      <FieldSwitchInputComponent
        disabled
        className="any-classname"
        input={{
          checked: true,
          name: 'input-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: '',
        }}
        label="any-label"
        legend={{ active: '', inactive: '' }}
      />,
    );
    const element = getByTestId('field-switch-input');
    // then
    expect(element).toHaveAttribute('checked');
    expect(element).toHaveAttribute('disabled');
  });

  it('should call FieldSwitchLegendComponent and FieldSwitchLabelComponent with defined props', () => {
    // when
    render(
      <FieldSwitchInputComponent
        disabled
        className="any-classname"
        input={{
          checked: true,
          name: 'input-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          value: '',
        }}
        label="any-label"
        legend={{ active: 'checked-legend', inactive: 'unchecked-legend' }}
      />,
    );
    // then
    expect(FieldSwitchLegendComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchLegendComponent).toHaveBeenCalledWith(
      {
        checked: true,
        legend: { active: 'checked-legend', inactive: 'unchecked-legend' },
      },
      {},
    );
    expect(FieldSwitchLabelComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchLabelComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        checked: true,
        label: 'any-label',
        name: 'input-name-mock',
        rtl: undefined,
      }),
      {},
    );
  });
});
