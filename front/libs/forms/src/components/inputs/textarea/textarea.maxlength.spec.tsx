import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { TextAreaMaxlengthComponent } from './textarea.maxlength';

describe('TextAreaMaxlengthComponent', () => {
  it('should match the snapshot, when under limit', () => {
    // When
    const { container } = render(
      <TextAreaMaxlengthComponent count={1} maxLength={10} treshold={1} />,
    );
    const spanElement = container.querySelector('span');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Form.textarea.maxlength', { maxLength: 10 });
    expect(spanElement).not.toHaveClass('textareaOfflimit');
    expect(spanElement).not.toHaveClass('textareaCloseTolimit');
  });

  it('should match the snapshot, when limit is close to be reached', () => {
    // When
    const { container } = render(
      <TextAreaMaxlengthComponent count={9} maxLength={10} treshold={2} />,
    );
    const spanElement = container.querySelector('span');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledWith('Form.textarea.maxlength', { maxLength: 10 });
    expect(spanElement).not.toHaveClass('textareaOfflimit');
    expect(spanElement).toHaveClass('textareaCloseTolimit');
  });

  it('should match the snapshot, when limit is reached', () => {
    // When
    const { container } = render(<TextAreaMaxlengthComponent count={11} maxLength={10} />);
    const spanElement = container.querySelector('span');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledWith('Form.textarea.maxlength', { maxLength: 10 });
    expect(spanElement).toHaveClass('textareaOfflimit');
    expect(spanElement).not.toHaveClass('textareaCloseTolimit');
  });
});
