import { render } from '@testing-library/react';
import { Outlet } from 'react-router';
import { useDocumentTitle } from 'usehooks-ts';

import { IdentityTheftReportLayout } from './identity-theft-report.layout';

describe('IdentityTheftReportLayout', () => {
  it('should match snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportLayout />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render document title', () => {
    // When
    render(<IdentityTheftReportLayout />);

    // Then
    expect(useDocumentTitle).toHaveBeenCalledExactlyOnceWith(
      'Mon tableau de bord - Signaler une usurpation',
    );
  });

  it('should render route children', () => {
    // When
    render(<IdentityTheftReportLayout />);

    // Then
    expect(Outlet).toHaveBeenCalledExactlyOnceWith({});
  });
});
