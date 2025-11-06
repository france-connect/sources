import { render } from '@testing-library/react';

import { ButtonTypes, SimpleButton } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { FormActionsComponent } from './form-actions.component';

describe('FormActionsComponent', () => {
  describe('actions are undefined', () => {
    it('should match the snapshot', () => {
      // When
      const { container } = render(<FormActionsComponent canSubmit />);

      // Then
      expect(container).toMatchSnapshot();
    });

    it('should call SimpleButton with default action params', () => {
      // Given
      jest.mocked(t).mockReturnValueOnce('any-form-submit-label-mock');

      // When
      render(<FormActionsComponent canSubmit />);

      // Then
      expect(t).toHaveBeenCalledExactlyOnceWith('Form.submit');
      expect(SimpleButton).toHaveBeenCalledExactlyOnceWith(
        {
          children: 'any-form-submit-label-mock',
          className: 'fr-mr-1w',
          disabled: false,
          priority: 'primary',
          size: 'md',
          type: 'submit',
        },
        undefined,
      );
    });
  });

  describe('actions are defined', () => {
    // Given
    const disabledMock = jest.fn(({ canSubmit }) => !canSubmit);
    const actionsMock = [
      {
        disabled: disabledMock,
        label: 'Form.submit',
        type: ButtonTypes.SUBMIT,
      },
      {
        disabled: true,
        label: 'Any.i18n.translation.key',
        type: ButtonTypes.BUTTON,
      },
    ];

    it('should throw an error if more than one submit button is defined', () => {
      // Given
      const actionsWithTwoSubmitButtons = [
        ...actionsMock,
        {
          label: expect.any(String),
          type: ButtonTypes.SUBMIT,
        },
      ];

      // When / Then
      expect(() =>
        render(<FormActionsComponent canSubmit actions={actionsWithTwoSubmitButtons} />),
      ).toThrow('FormActionsComponent: Only one button with type "submit" is allowed.');
    });

    it('should match the snapshot when actions are defined', () => {
      // When
      const { container } = render(<FormActionsComponent canSubmit actions={actionsMock} />);

      // Then
      expect(container).toMatchSnapshot();
    });

    it('should call SimpleButton 2 times with defined action params', () => {
      // Given
      jest
        .mocked(t)
        .mockReturnValueOnce('any-form-submit-label-mock')
        .mockReturnValueOnce('any-i18n-translation-key-mock');

      // When
      render(<FormActionsComponent canSubmit actions={actionsMock} />);

      // Then
      expect(t).toHaveBeenCalledWith('Form.submit');
      expect(t).toHaveBeenCalledWith('Any.i18n.translation.key');

      expect(SimpleButton).toHaveBeenCalledTimes(2);

      expect(SimpleButton).toHaveBeenNthCalledWith(
        1,
        {
          children: 'any-form-submit-label-mock',
          className: 'fr-mr-1w',
          disabled: false,
          priority: 'primary',
          size: 'md',
          type: 'submit',
        },
        undefined,
      );

      expect(SimpleButton).toHaveBeenNthCalledWith(
        2,
        {
          children: 'any-i18n-translation-key-mock',
          className: 'fr-mr-1w',
          disabled: true,
          priority: 'primary',
          size: 'md',
          type: 'button',
        },
        undefined,
      );
    });
  });
});
