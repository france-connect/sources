// @see _doc/jest.md
import { render } from '@testing-library/react';
import * as ReactFinalForm from 'react-final-form';

import { FieldSwitchComponent } from './field-switch.component';
import { FieldSwitchInputComponent } from './field-switch-input.component';

// given
jest.mock('./field-switch-input.component');

const Wrapper = ({ children }: { children: React.ReactElement }) => (
  <ReactFinalForm.Form onSubmit={jest.fn()}>
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </ReactFinalForm.Form>
);

describe('FieldSwitchComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ReactFinalForm.Field with props', () => {
    // given
    const fieldSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(ReactFinalForm.Field as any, 'render')
      .mockImplementation(() => <div />);
    // when
    render(<FieldSwitchComponent label="any-label" name="any-name" />, { wrapper: Wrapper });
    // then
    expect(fieldSpy).toHaveBeenCalledTimes(1);
    expect(fieldSpy).toHaveBeenNthCalledWith(
      1,
      {
        children: expect.any(Function),
        initialValue: undefined,
        name: 'any-name',
        type: 'checkbox',
      },
      null,
    );
    fieldSpy.mockRestore();
  });

  it('should call FieldSwitchInputComponent default props', () => {
    // when
    render(<FieldSwitchComponent label="any-label" name="any-name" />, { wrapper: Wrapper });
    // then
    expect(FieldSwitchInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchInputComponent).toHaveBeenCalledWith(
      {
        className: undefined,
        disabled: undefined,
        input: expect.objectContaining({
          checked: false,
          name: 'any-name',
          type: 'checkbox',
        }),
        label: 'any-label',
        legend: { active: 'activé', inactive: 'désactivé' },
        rtl: undefined,
      },
      {},
    );
  });

  it('should call FieldSwitchInputComponent classname props', () => {
    // when
    render(<FieldSwitchComponent className="any-classname" label="any-label" name="any-name" />, {
      wrapper: Wrapper,
    });
    // then
    expect(FieldSwitchInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchInputComponent).toHaveBeenCalledWith(
      {
        className: 'any-classname',
        disabled: undefined,
        input: expect.objectContaining({
          checked: false,
          name: 'any-name',
          type: 'checkbox',
        }),
        label: 'any-label',
        legend: { active: 'activé', inactive: 'désactivé' },
        rtl: undefined,
      },
      {},
    );
  });

  it('should call FieldSwitchInputComponent with disabled props', () => {
    // when
    render(<FieldSwitchComponent disabled label="any-label" name="any-name" />, {
      wrapper: Wrapper,
    });
    // then
    expect(FieldSwitchInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchInputComponent).toHaveBeenCalledWith(
      {
        className: undefined,
        disabled: true,
        input: expect.any(Object),
        label: 'any-label',
        legend: { active: 'activé', inactive: 'désactivé' },
      },
      {},
    );
  });

  it('should call FieldSwitchInputComponent with rtl props', () => {
    // when
    render(<FieldSwitchComponent rtl label="any-label" name="any-name" />, {
      wrapper: Wrapper,
    });
    // then
    expect(FieldSwitchInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchInputComponent).toHaveBeenCalledWith(
      {
        className: undefined,
        disabled: undefined,
        input: expect.any(Object),
        label: 'any-label',
        legend: { active: 'activé', inactive: 'désactivé' },
        rtl: true,
      },
      {},
    );
  });

  it('should call FieldSwitchInputComponent with legend props', () => {
    // when
    render(
      <FieldSwitchComponent
        label="any-label"
        legend={{ active: 'checked', inactive: 'unchecked' }}
        name="any-name"
      />,
      {
        wrapper: Wrapper,
      },
    );
    // then
    expect(FieldSwitchInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchInputComponent).toHaveBeenCalledWith(
      {
        className: undefined,
        disabled: undefined,
        input: expect.any(Object),
        label: 'any-label',
        legend: { active: 'checked', inactive: 'unchecked' },
        rtl: undefined,
      },
      {},
    );
  });
});
