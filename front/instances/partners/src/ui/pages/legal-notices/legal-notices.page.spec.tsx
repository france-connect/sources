import { render } from '@testing-library/react';

import { LegalNoticesPage } from './legal-notices.page';

describe('LegalNoticesPage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<LegalNoticesPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
