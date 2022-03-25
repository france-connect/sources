import { fireEvent, render } from '@testing-library/react';

import { FieldCheckboxInputComponent } from './field-checkbox-input.component';
import { FieldCheckboxLabelComponent } from './field-checkbox-label.component';

// given
jest.mock('./field-checkbox-label.component');

describe('FieldCheckboxComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call FieldCheckboxLabelComponent with default props', () => {
    // when
    render(
      <FieldCheckboxInputComponent
        rtl
        className=""
        disabled={false}
        input={{
          checked: false,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    // then
    expect(FieldCheckboxLabelComponent).toHaveBeenCalledTimes(1);
    expect(FieldCheckboxLabelComponent).toHaveBeenNthCalledWith(
      1,
      {
        checked: false,
        disabled: false,
        label: 'any-label-mock',
        name: 'any-name-mock',
        rtl: true,
      },
      {},
    );
  });

  it('should call FieldCheckboxInputComponent with classname props', () => {
    // when
    const { container } = render(
      <FieldCheckboxInputComponent
        rtl
        className="any-class-mock"
        disabled={false}
        input={{
          checked: false,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    // then
    expect(container.firstChild).toHaveClass('FieldCheckboxInputComponent');
    expect(container.firstChild).toHaveClass('any-class-mock');
  });

  it('should call FieldCheckboxLabelComponent with checked as true', () => {
    // when
    render(
      <FieldCheckboxInputComponent
        className=""
        disabled={false}
        input={{
          checked: true,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    // then
    expect(FieldCheckboxLabelComponent).toHaveBeenCalledTimes(1);
    expect(FieldCheckboxLabelComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        checked: true,
      }),
      {},
    );
  });

  it('should render a checkbox input with props', () => {
    // when
    const { getByTestId } = render(
      <FieldCheckboxInputComponent
        disabled
        className=""
        input={{
          checked: true,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    const element = getByTestId('field-checkbox-input') as HTMLInputElement;
    // then
    expect(element.tagName).toStrictEqual('INPUT');
    expect(element).toHaveAttribute('type', 'checkbox');
    expect(element).toHaveAttribute('id', 'any-name-mock');
    expect(element).toHaveAttribute('name', 'any-name-mock');
    expect(element.checked).toStrictEqual(true);
    expect(element.disabled).toStrictEqual(true);
  });

  it('should render a checkbox input without checked props', () => {
    // when
    const { getByTestId } = render(
      <FieldCheckboxInputComponent
        className=""
        disabled={false}
        input={{
          checked: false,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    const element = getByTestId('field-checkbox-input') as HTMLInputElement;
    // then
    expect(element.tagName).toStrictEqual('INPUT');
    expect(element.checked).toStrictEqual(false);
    expect(element.disabled).toStrictEqual(false);
  });

  it('should have specific css classes to match the desired behavior', () => {
    // when
    const { container, getByTestId } = render(
      <FieldCheckboxInputComponent
        className=""
        disabled={false}
        input={{
          checked: false,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: jest.fn(),
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    const element = getByTestId('field-checkbox-input') as HTMLInputElement;
    // then
    expect(element.tagName).toStrictEqual('INPUT');
    expect(element).toHaveClass('is-absolute opacity-0');
    expect(container.firstChild).toHaveClass('is-relative');
  });

  it('should call onChange when clicking checkbox', () => {
    // given
    const onChangeMock = jest.fn();
    // when
    const { getByTestId } = render(
      <FieldCheckboxInputComponent
        className=""
        disabled={false}
        input={{
          checked: false,
          name: 'any-name-mock',
          onBlur: jest.fn(),
          onChange: onChangeMock,
          onFocus: jest.fn(),
          type: 'checkbox',
          value: undefined,
        }}
        label="any-label-mock"
      />,
    );
    const element = getByTestId('field-checkbox-input') as HTMLInputElement;
    fireEvent.click(element);
    // then
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
