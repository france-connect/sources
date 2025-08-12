import { render } from '@testing-library/react';

import { EventTypes } from '@fc/common';
import { ConfigService } from '@fc/config';

import type { FieldMessage } from '../../../interfaces';
import { MessageElement } from '../message';
import { MessagesElement } from './messages.element';

// Given
jest.mock('../message/message.element');

describe('MessagesElement', () => {
  const infoMessageMock1: FieldMessage = {
    content: 'mockInfo1',
    level: EventTypes.INFO,
    priority: 20,
  };
  const infoMessageMock2: FieldMessage = {
    content: 'mockInfo2',
    level: EventTypes.INFO,
    priority: 20,
  };
  const errorMessageMock: FieldMessage = {
    content: 'mockError',
    level: EventTypes.ERROR,
    priority: 50,
  };

  beforeEach(() => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValue({ showFieldValidationMessage: true });
  });

  it('should match the snapshot, without message', () => {
    // When
    const { container } = render(<MessagesElement id="id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageElement).not.toHaveBeenCalled();
  });

  it('should match the snapshot, with one message', () => {
    // Given
    const messages: FieldMessage[] = [infoMessageMock1];

    // When
    const { container } = render(<MessagesElement id="id-mock" messages={messages} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        content: 'mockInfo1',
        dataTestId: undefined,
        id: 'id-mock',
        level: 'info',
      },
      undefined,
    );
  });

  it('should match the snapshot, with two messages of same priority', () => {
    // Given
    const messages: FieldMessage[] = [infoMessageMock1, infoMessageMock2];

    // When
    const { container } = render(<MessagesElement id="id-mock" messages={messages} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageElement).toHaveBeenCalledTimes(2);
    expect(MessageElement).toHaveBeenNthCalledWith(
      1,
      {
        content: 'mockInfo1',
        dataTestId: undefined,
        id: 'id-mock',
        level: 'info',
      },
      undefined,
    );
    expect(MessageElement).toHaveBeenNthCalledWith(
      2,
      {
        content: 'mockInfo2',
        dataTestId: undefined,
        id: 'id-mock',
        level: 'info',
      },
      undefined,
    );
  });

  it('should match the snapshot, with only the highest priority messages', () => {
    // Given
    const messages: FieldMessage[] = [infoMessageMock1, errorMessageMock];

    // When
    const { container } = render(<MessagesElement id="id-mock" messages={messages} />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('aria-live', 'assertive');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock');
    expect(container.firstChild).toHaveClass('fr-messages-group');
    expect(MessageElement).toHaveBeenCalledOnce();
    expect(MessageElement).toHaveBeenCalledWith(
      {
        content: 'mockError',
        dataTestId: undefined,
        id: 'id-mock',
        level: 'error',
      },
      undefined,
    );
  });
});
