import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { useFieldMeta } from '../../../hooks';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { SelectInput } from './select.input';

jest.mock('../../elements/group/group.element');
jest.mock('../../elements/label/label.element');
jest.mock('../../elements/message/message.element');
jest.mock('../../../hooks/field-meta/field-meta.hook');

describe('SelectInput', () => {
  // Given
  const inputMock = {
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'any-value-mock',
  };
  const choices = [
    { label: 'mock-label-1', value: 'mock-value-1' },
    { label: 'mock-label-2', value: 'mock-value-2' },
  ];

  it('should match the snapshot when is valid', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorMessage: undefined,
      hasError: false,
      inputClassname: 'any-input-classname-mock',
      isValid: true,
    });

    // When
    const { container } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: undefined, touched: false }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({ error: undefined, touched: false });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-className-mock',
        disabled: false,
        hasError: false,
        isValid: true,
        type: 'select',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        error: undefined,
        id: 'any-name-mock',
        isValid: true,
      },
      undefined,
    );
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.select.placeholder');
  });

  it('should match the snapshot when has error', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });

    // When
    const { container } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: 'any-error-message-mock', touched: false }}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(useFieldMeta).toHaveBeenCalledOnce();
    expect(useFieldMeta).toHaveBeenCalledWith({ error: 'any-error-message-mock', touched: false });
    expect(GroupElement).toHaveBeenCalledOnce();
    expect(GroupElement).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'any-className-mock',
        disabled: false,
        hasError: true,
        isValid: false,
        type: 'select',
      },
      undefined,
    );
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: 'any-hint-mock',
        label: 'any-label-mock',
        name: 'any-name-mock',
        required: true,
      },
      undefined,
    );
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        error: 'any-error-message-mock',
        id: 'any-name-mock',
        isValid: false,
      },
      undefined,
    );
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.select.placeholder');
  });

  it('should render 2 select.option', () => {
    // Given
    jest.mocked(useFieldMeta).mockReturnValueOnce({
      errorMessage: 'any-error-message-mock',
      hasError: true,
      inputClassname: 'any-input-classname-mock',
      isValid: false,
    });

    // When
    const { getByText } = render(
      <SelectInput
        choices={choices}
        config={{ hint: 'any-hint-mock', label: 'any-label-mock', required: true }}
        input={{
          ...inputMock,
          className: 'any-className-mock',
          disabled: false,
          name: 'any-name-mock',
        }}
        meta={{ error: 'any-error-message-mock', touched: false }}
      />,
    );
    const optionElt1 = getByText('mock-label-1');
    const optionElt2 = getByText('mock-label-2');

    // Then
    expect(optionElt1).toBeInTheDocument();
    expect(optionElt1).toHaveAttribute('value', 'mock-value-1');
    expect(optionElt2).toBeInTheDocument();
    expect(optionElt2).toHaveAttribute('value', 'mock-value-2');
  });
});
