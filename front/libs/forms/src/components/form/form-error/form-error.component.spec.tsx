import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { FormErrorScrollComponent } from '../form-error-scroll';
import { FormErrorComponent } from './form-error.component';

jest.mock('../form-error-scroll/form-error-scroll.component');

describe('FormErrorComponent', () => {
  it('should match the snapshot when error is defined', () => {
    // When
    const { container, getByText } = render(<FormErrorComponent error="any-error-message-mock" />);
    const textElt = getByText('any-error-message-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.message.requestFailed');
    expect(textElt).toBeInTheDocument();
    expect(FormErrorScrollComponent).toHaveBeenCalledOnce();
    expect(FormErrorScrollComponent).toHaveBeenCalledWith(
      {
        active: true,
        elementClassName: '.fr-alert--error',
      },
      {},
    );
  });

  it('should match the snapshot when error is not defined', () => {
    // When
    const { container } = render(<FormErrorComponent error="any-error-message-mock" />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
