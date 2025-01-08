import { render } from '@testing-library/react';

import { FormMentionsComponent } from './form-mentions.component';

describe('FormMentionsComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<FormMentionsComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
