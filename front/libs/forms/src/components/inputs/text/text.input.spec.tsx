import { render } from '@testing-library/react';

import { useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { InputComponent } from '../input';
import { TextInput } from './text.input';
import { InputWithClipboard } from './with-clipboard';

jest.mock('./with-clipboard/with-clipboard.input');
jest.mock('../input/input.component');
jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/message/message.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');

describe('TextInput', () => {
  // Given
  const isValidMock = Symbol('isValidMock') as unknown as boolean;
  const hasErrorMock = Symbol('hasErrorMock') as unknown as boolean;
  const touchedMock = Symbol('touchedMock') as unknown as boolean;
  const readonlyMock = Symbol('readonlyMock') as unknown as boolean;

  const propsMock = {
    config: {
      hint: 'any-hint-mock',
      label: 'any-label-mock',
      readonly: readonlyMock,
    },
    input: {
      className: 'any-classname-mock',
      name: 'any-name-mock',
      type: 'text',
      value: 'any-input-value-mock',
    },
    meta: {
      error: 'any-errorMessage-mock',
      touched: touchedMock,
      value: 'any-input-value-mock',
    },
  } as unknown as PropsWithInputConfigType;

  beforeEach(() => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorMessage: 'any-errorMessage-mock',
      hasError: hasErrorMock,
      inputClassname: 'any-inputClassname-mock',
      isValid: isValidMock,
    });
  });

  it('should match snapshot', () => {
    // When
    const { container } = render(<TextInput {...propsMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({
      error: 'any-errorMessage-mock',
      touched: touchedMock,
      value: 'any-input-value-mock',
    });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Array),
        className: 'any-classname-mock',
        hasError: hasErrorMock,
        isValid: isValidMock,
        type: 'input',
      },
      {},
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
      },
      {},
    );
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        dataTestId: 'any-name-mock-messages',
        error: 'any-errorMessage-mock',
        id: 'any-name-mock',
        isValid: isValidMock,
      },
      {},
    );
  });

  it('should match snapshot, when readonly is true', () => {
    // Given
    const propsReadOnlyMock = {
      ...propsMock,
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: true,
      },
    };

    // When
    const { container } = render(<TextInput {...propsReadOnlyMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InputWithClipboard).toHaveBeenCalledOnce();
    expect(InputWithClipboard).toHaveBeenCalledWith(
      {
        className: 'fr-mt-1w',
        id: 'form-input-text-any-name-mock',
        input: propsMock.input,
        inputClassname: 'any-inputClassname-mock',
      },
      {},
    );
  });

  it('should match snapshot, when readonly is false', () => {
    // Given
    const propsReadOnlyMock = {
      ...propsMock,
      config: {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        readonly: false,
      },
    };

    // When
    const { container } = render(<TextInput {...propsReadOnlyMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(InputComponent).toHaveBeenCalledOnce();
    expect(InputComponent).toHaveBeenCalledWith(
      {
        className: 'any-inputClassname-mock',
        id: 'form-input-text-any-name-mock',
        input: propsMock.input,
      },
      {},
    );
  });
});
