import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { MessageValidElement } from './message-valid.element';

describe('MessageValidElement', () => {
  it('should match the snapshot', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-i18n-valid-message');

    // When
    const { container, getByText } = render(
      <MessageValidElement dataTestId="MessageValidElement" id="id-mock" />,
    );
    const validTextElt = getByText('any-i18n-valid-message');

    // Then
    expect(container).toMatchSnapshot();
    expect(validTextElt).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('fr-valid-text');
    expect(container.firstChild).toHaveAttribute('id', 'id-mock-messages');
    expect(container.firstChild).toHaveAttribute('data-testid', 'MessageValidElement');
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.message.valid');
  });

  it('should render without the data-testid', () => {
    // When
    const { container } = render(<MessageValidElement id="id-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).not.toHaveAttribute('data-testid');
  });
});
