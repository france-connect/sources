import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { MessageElement } from './message.element';

describe('MessageElement', () => {
  it('should match the snapshot when has error', () => {
    // When
    const { container, getByText } = render(<MessageElement error="error-mock" id="id-mock" />);
    const errorTextElt = getByText('error-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(errorTextElt).toBeInTheDocument();
    expect(errorTextElt).toHaveAttribute('id', 'id-mock-messages');
    expect(errorTextElt).toHaveClass('fr-message');
    expect(errorTextElt).toHaveClass('fr-message--error');
  });

  it('should match the snapshot when error is not defined', () => {
    // When
    const { container, getByText } = render(<MessageElement isValid id="id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(() => getByText('error-mock')).toThrow();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.message.valid');
  });
});
