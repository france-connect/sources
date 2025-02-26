import { render } from '@testing-library/react';

import { FormMentionsComponent } from './form-mentions.component';

describe('FormMentionsComponent', () => {
  it('should match the snapshot', () => {
    // Given
    const contextMock = 'What is Lorem Ipsum?';

    // When
    const { container, getByText } = render(<FormMentionsComponent content={contextMock} />);
    const contentElt = getByText('What is Lorem Ipsum?');

    // Then
    expect(container).toMatchSnapshot();
    expect(contentElt).toBeInTheDocument();
  });
});
