import { render } from '@testing-library/react';

import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';

import { IdentityTheftReportContactPage } from './identity-theft-report-contact.page';

describe('IdentityTheftReportContactPage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportContactPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render IdentityTheftReportFormComponent with arguments', () => {
    // When
    render(<IdentityTheftReportContactPage />);

    // Then
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledOnce();
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledWith(
      {
        id: 'IdentityTheftContact',
      },
      undefined,
    );
  });
});
