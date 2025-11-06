import { render } from '@testing-library/react';

import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';

import { IdentityTheftReportIdentityPage } from './identity-theft-report-identity.page';

describe('IdentityTheftReportIdentityPage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportIdentityPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render IdentityTheftReportFormComponent with arguments', () => {
    // When
    render(<IdentityTheftReportIdentityPage />);

    // Then
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledOnce();
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledWith(
      {
        id: 'IdentityTheftIdentity',
      },
      undefined,
    );
  });
});
