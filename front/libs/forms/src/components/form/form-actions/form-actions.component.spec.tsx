import { render } from '@testing-library/react';

import { SimpleButton, Sizes } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { FormActionsComponent } from './form-actions.component';

describe('FormActionsComponent', () => {
  it('should match the snapshot when reset button is not defined', () => {
    // When
    const { container } = render(<FormActionsComponent canSubmit />);

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'Form.submit',
        disabled: false,
        size: 'md',
        type: 'submit',
      },
      {},
    );
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.submit');
  });

  it('should match the snapshot when reset button is defined', () => {
    // When
    const { container } = render(<FormActionsComponent canSubmit showReset size={Sizes.LARGE} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledTimes(2);
    expect(SimpleButton).toHaveBeenNthCalledWith(
      1,
      {
        children: 'Form.reset',
        className: 'fr-mr-1w',
        priority: 'secondary',
        size: 'lg',
        type: 'reset',
      },
      {},
    );
    expect(SimpleButton).toHaveBeenNthCalledWith(
      2,
      {
        children: 'Form.submit',
        disabled: false,
        size: 'lg',
        type: 'submit',
      },
      {},
    );
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenCalledWith('Form.submit');
  });

  it('should match the snapshot when submit label is defined', () => {
    // Given
    const submitLabelMock = 'any-submit-label-mock';

    // When
    const { container } = render(<FormActionsComponent canSubmit submitLabel={submitLabelMock} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(SimpleButton).toHaveBeenCalledOnce();
    expect(SimpleButton).toHaveBeenCalledWith(
      {
        children: 'any-submit-label-mock',
        disabled: false,
        size: 'md',
        type: 'submit',
      },
      {},
    );
  });
});
