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

  const inputMock = {
    name: 'any_name_mock',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'any_value_mock',
  };

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <ChoiceInput
        choice={{
          hint: choiceHintMock,
          label: choiceLabelMock,
          value: 'any_choice_value_mock',
        }}
        config={{
          inline: false,
          label: Symbol('not used label') as unknown as string,
          size: Sizes.LARGE,
        }}
        input={inputMock}
        meta={expect.any(Object)}
        type={FieldTypes.RADIO}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toHaveClass('fr-fieldset__element--inline');
    expect(LabelElement).toHaveBeenCalledOnce();
    expect(LabelElement).toHaveBeenCalledWith(
      {
        hint: choiceHintMock,
        label: choiceLabelMock,
        name: 'form-input-radio-any_name_mock-any_choice_value_mock',
      },
      {},
    );
  });

  it('should match the snapshot when inline and size are not defined', () => {
    // When
    const { container } = render(
      <ChoiceInput
        choice={{
          hint: choiceHintMock,
          label: choiceLabelMock,
          value: 'any_choice_value_mock',
        }}
        config={{
          label: Symbol('not used label') as unknown as string,
        }}
        input={inputMock}
        meta={expect.any(Object)}
        type={FieldTypes.RADIO}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-fieldset__element--inline');
  });
});
