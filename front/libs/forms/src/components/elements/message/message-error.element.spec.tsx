import { render } from '@testing-library/react';

import { MessageErrorElement } from './message-error.element';

describe('MessageErrorElement', () => {
  it('should match the snapshot, when error is a string', () => {
    // Given
    const id = 'id-mock';
    const error = 'any-error-message';

    // When
    const { container, getByText } = render(<MessageErrorElement error={error} id={id} />);
    const errorTextElt = getByText('any-error-message');

    // Then
    expect(container).toMatchSnapshot();
    expect(errorTextElt).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('fr-message fr-message--error');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock-messages');
    expect(container.children).toHaveLength(1);
  });

  it('should match the snapshot, when error is an array of string', () => {
    // Given
    const id = 'id-mock';
    const error = ['any-error-message-1', 'any-error-message-2', 'any-error-message-3'];

    // When
    const { container, getByText } = render(<MessageErrorElement error={error} id={id} />);
    const errorTextElt1 = getByText('any-error-message-1');
    const errorTextElt2 = getByText('any-error-message-2');
    const errorTextElt3 = getByText('any-error-message-3');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.children).toHaveLength(3);

    expect(errorTextElt1).toBeInTheDocument();
    expect(errorTextElt1).toHaveClass('fr-message fr-message--error');
    expect(errorTextElt1).toHaveAttribute('id', 'id-mock-messages');

    expect(errorTextElt2).toBeInTheDocument();
    expect(errorTextElt2).toHaveClass('fr-message fr-message--error');
    expect(errorTextElt2).toHaveAttribute('id', 'id-mock-messages');

    expect(errorTextElt3).toBeInTheDocument();
    expect(errorTextElt3).toHaveClass('fr-message fr-message--error');
    expect(errorTextElt3).toHaveAttribute('id', 'id-mock-messages');
  });
});
