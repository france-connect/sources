import { render } from '@testing-library/react';
import * as ReactFinalForm from 'react-final-form';

import { FieldCheckboxComponent } from './field-checkbox.component';
import { FieldCheckboxInputComponent } from './field-checkbox-input.component';

// given
jest.mock('./field-checkbox-input.component');

const Wrapper = ({ children }: { children: React.ReactElement }) => (
  <ReactFinalForm.Form onSubmit={jest.fn()}>
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </ReactFinalForm.Form>
);

describe('FieldCheckboxComponent', () => {
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
    render(
      <FieldCheckboxComponent
        className="any-class-mock"
        label="any-label-mock"
        name="any-name-mock"
      />,
      { wrapper: Wrapper },
    );
    // then
    expect(fieldSpy).toHaveBeenCalledTimes(1);
    expect(fieldSpy).toHaveBeenNthCalledWith(
      1,
      {
        children: expect.any(Function),
        name: 'any-name-mock',
        type: 'checkbox',
      },
      null,
    );
    fieldSpy.mockRestore();
  });

  it('should call FieldCheckboxInputComponent with default props', () => {
    // when
    render(<FieldCheckboxComponent label="any-label-mock" name="any-name-mock" />, {
      wrapper: Wrapper,
    });
    // then
    expect(FieldCheckboxInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldCheckboxInputComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: undefined,
        disabled: undefined,
        input: expect.objectContaining({
          name: 'any-name-mock',
          type: 'checkbox',
        }),
        label: 'any-label-mock',
        rtl: undefined,
      },
      {},
    );
  });

  it('should call FieldCheckboxInputComponent with props', () => {
    // when
    render(
      <FieldCheckboxComponent
        disabled
        rtl
        className="any-class-mock"
        label="any-label-mock"
        name="any-name-mock"
      />,
      { wrapper: Wrapper },
    );
    // then
    expect(FieldCheckboxInputComponent).toHaveBeenCalledTimes(1);
    expect(FieldCheckboxInputComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: 'any-class-mock',
        disabled: true,
        input: expect.objectContaining({ name: 'any-name-mock' }),
        label: 'any-label-mock',
        rtl: true,
      },
      {},
    );
  });
});
