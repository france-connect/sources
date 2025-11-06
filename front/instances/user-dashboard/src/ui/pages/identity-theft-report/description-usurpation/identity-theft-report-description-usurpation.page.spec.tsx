import { render } from '@testing-library/react';

import { IdentityTheftReportFormComponent } from '@fc/core-user-dashboard';

import { IdentityTheftReportDescriptionUsurpationPage } from './identity-theft-report-description-usurpation.page';

describe('IdentityTheftReportDescriptionUsurpationPage', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportDescriptionUsurpationPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render IdentityTheftReportFormComponent with arguments', () => {
    // When
    render(<IdentityTheftReportDescriptionUsurpationPage />);

    // Then
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledOnce();
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledWith(
      {
        id: 'IdentityTheftDescription',
      },
      undefined,
    );
  });
});
