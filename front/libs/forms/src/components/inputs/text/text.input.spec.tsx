import { render } from '@testing-library/react';

import { useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { TextInput } from './text.input';

jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/message/message.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');

describe('TextInput', () => {
  it('should match snapshot', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValue({
      errorMessage: 'any errorMessage mock',
      hasError: true,
      inputClassname: 'any inputClassname mock',
      isValid: true,
    });

    const propsMock = {
      config: {
        hint: 'any hint mock',
        label: 'any label mock',
      },
      input: {
        className: 'any classname mock',
        disabled: true,
        name: 'any name mock',
        type: 'text',
        value: 'any input value mock',
      },
      meta: {
        error: 'any errorMessage mock',
        touched: false,
        value: 'any input value mock',
      },
    } as unknown as PropsWithInputConfigType<string>;

    // When
    const { container, getByDisplayValue } = render(<TextInput {...propsMock} />);
    const inputElement = getByDisplayValue('any input value mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({
      error: 'any errorMessage mock',
      touched: false,
      value: 'any input value mock',
    });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Array),
        className: 'any classname mock',
        disabled: true,
        hasError: true,
        isValid: true,
        type: 'input',
      },
      {},
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any hint mock',
        label: 'any label mock',
        name: 'any name mock',
      },
      {},
    );
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('class', 'any inputClassname mock');
    expect(inputElement).toHaveAttribute('disabled');
    expect(inputElement).toHaveAttribute('name', 'any name mock');
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        error: 'any errorMessage mock',
        id: 'any name mock',
        isValid: true,
      },
      {},
    );
  });
});
