import { render } from '@testing-library/react';

import { IdentityTheftReportSuccessPage } from './identity-theft-report-success.page';

describe('IdentityTheftReportSuccessPage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportSuccessPage />);

    // Then
    expect(container).toMatchSnapshot();
  });
});
