import { render } from '@testing-library/react';

import { Sizes } from '@fc/dsfr';
import { FieldTypes } from '@fc/forms';

import { LabelElement } from '../../elements';
import { ChoiceInput } from './choice.input';

jest.mock('../../elements/label/label.element');

describe('ChoiceInput', () => {
  // Given
  const choiceHintMock = Symbol('hint') as unknown as string;
  const choiceLabelMock = Symbol('label') as unknown as string;
  const choiceInlineMock = Symbol('inline') as unknown as boolean;

  const inputMock = {
    name: 'any_name_mock',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    type: FieldTypes.RADIO,
    value: 'any_value_mock',
  };

  it('should match the snapshot', () => {
    // When
    const { container, getByTestId } = render(
      <ChoiceInput
        choice={{
          disabled: false,
          hint: choiceHintMock,
          label: choiceLabelMock,
          value: 'any_choice_value_mock',
        }}
        config={{
          inline: choiceInlineMock,
          label: Symbol('not used label') as unknown as string,
          size: Sizes.LARGE,
        }}
        input={inputMock}
        meta={expect.any(Object)}
        type={FieldTypes.RADIO}
      />,
    );
    const inputElt = getByTestId('any_name_mock-any_choice_value_mock--testid');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-fieldset__element');
    expect(container.firstChild).toHaveClass('fr-fieldset__element--inline');
    expect(container.firstChild!.firstChild).toHaveClass('fr-radio-group');
    expect(container.firstChild!.firstChild).toHaveClass('fr-radio-group--lg');
    expect(inputElt).toHaveAttribute('type', 'radio');
    expect(inputElt).toHaveAttribute('name', 'any_name_mock');
    expect(inputElt).toHaveAttribute('value', 'any_value_mock');
    expect(inputElt).toHaveAttribute('id', 'any_name_mock-any_choice_value_mock');
    expect(inputElt).toHaveAttribute('data-testid', 'any_name_mock-any_choice_value_mock--testid');
    expect(inputElt).not.toHaveAttribute('disabled');
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: choiceHintMock,
        label: choiceLabelMock,
        name: 'any_name_mock-any_choice_value_mock',
      },
      {},
    );
  });

  it('should match the snapshot when disabled is true, inline is false and size is not defined', () => {
    // When
    const { container, getByTestId } = render(
      <ChoiceInput
        choice={{
          disabled: true,
          hint: choiceHintMock,
          label: choiceLabelMock,
          value: 'any_choice_value_mock',
        }}
        config={{
          inline: false,
          label: Symbol('not used label') as unknown as string,
        }}
        input={inputMock}
        meta={expect.any(Object)}
        type={FieldTypes.RADIO}
      />,
    );
    const inputElt = getByTestId('any_name_mock-any_choice_value_mock--testid');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-fieldset__element');
    expect(container.firstChild).not.toHaveClass('fr-fieldset__element--inline');
    expect(container.firstChild!.firstChild).toHaveClass('fr-radio-group--md');
    expect(inputElt).toHaveAttribute('disabled');
  });
});
