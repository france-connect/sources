import { render } from '@testing-library/react';

import { MessageElement } from './message.element';
import classes from './message.module.scss';

describe('MessageElement', () => {
  it('should match the snapshot', () => {
    // Given
    const id = 'id-mock';
    const level = 'any-level';
    const content = 'any-content';

    // When
    const { container, getByText } = render(
      <MessageElement content={content} id={id} level={level} />,
    );
    const contentTextElt = getByText('any-content');

    // Then
    expect(container).toMatchSnapshot();
    expect(contentTextElt).toBeInTheDocument();
    expect(contentTextElt).toHaveClass(`${classes.message} fr-message fr-message--any-level`);
    expect(contentTextElt).toHaveAttribute('id', 'id-mock-messages');
  });
});
