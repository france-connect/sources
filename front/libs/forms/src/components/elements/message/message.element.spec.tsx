import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { MessageElement } from './message.element';
import { MessageErrorElement } from './message-error.element';
import { MessageValidElement } from './message-valid.element';

// Given
jest.mock('./message-error.element');
jest.mock('./message-valid.element');

describe('MessageElement', () => {
  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({ showFieldValidationMessage: true });
  });

  it('should match the snapshot', () => {
    // Given
    const errorMock = Symbol('error-mock') as unknown as string;

    // When
    const { container } = render(<MessageElement isValid error={errorMock} id="id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageValidElement).toHaveBeenCalledOnce();
    expect(MessageValidElement).toHaveBeenCalledWith({ id: 'id-mock' }, undefined);
    expect(MessageErrorElement).toHaveBeenCalledOnce();
    expect(MessageErrorElement).toHaveBeenCalledWith(
      { error: errorMock, id: 'id-mock' },
      undefined,
    );
  });

  it('should match the snapshot, when valid and error are not defined', () => {
    // When
    const { container } = render(<MessageElement id="id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageValidElement).not.toHaveBeenCalled();
    expect(MessageErrorElement).not.toHaveBeenCalled();
  });
});
