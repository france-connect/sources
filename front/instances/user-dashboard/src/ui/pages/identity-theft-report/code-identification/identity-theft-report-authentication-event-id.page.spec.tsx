import { render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import { HeadingTag, MessageTypes } from '@fc/common';
import {
  IdentityTheftReportFormComponent,
  IdentityTheftReportHelpEventIdAccordionComponent,
} from '@fc/core-user-dashboard';
import { AlertComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { IdentityTheftReportAuthenticationEventIdPage } from './identity-theft-report-authentication-event-id.page';

describe('IdentityTheftReportAuthenticationEventIdPage', () => {
  // Given
  const toggleHandlerMock = jest.fn();
  const toggleValueMock = expect.any(Boolean);

  beforeEach(() => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('IdentityTheftReport.codeIdentificationPage.title-mock')
      .mockReturnValueOnce('IdentityTheftReport.codeIdentificationPage.alertTitle-mock')
      .mockReturnValueOnce('IdentityTheftReport.codeIdentificationPage.alertContent-mock');
    jest
      .mocked(useToggle)
      .mockReturnValue([toggleValueMock, toggleHandlerMock, expect.any(Function)]);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportAuthenticationEventIdPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call the translations', () => {
    // When
    render(<IdentityTheftReportAuthenticationEventIdPage />);

    // Then
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'IdentityTheftReport.codeIdentificationPage.title');
    expect(t).toHaveBeenNthCalledWith(2, 'IdentityTheftReport.codeIdentificationPage.alertTitle');
    expect(t).toHaveBeenNthCalledWith(3, 'IdentityTheftReport.codeIdentificationPage.alertContent');
  });

  it('should render the title', () => {
    // When
    const { getByText } = render(<IdentityTheftReportAuthenticationEventIdPage />);
    const titleElt = getByText('IdentityTheftReport.codeIdentificationPage.title-mock');

    // Then
    expect(titleElt).toBeInTheDocument();
  });

  it('should call the AlertComponent', () => {
    // When
    const { getByText } = render(<IdentityTheftReportAuthenticationEventIdPage />);
    const contentElt = getByText('IdentityTheftReport.codeIdentificationPage.alertContent-mock');

    // Then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        heading: HeadingTag.H6,
        title: 'IdentityTheftReport.codeIdentificationPage.alertTitle-mock',
        type: MessageTypes.INFO,
      },
      undefined,
    );
    expect(contentElt).toBeInTheDocument();
  });

  it('should render IdentityTheftReportFormComponent with arguments', () => {
    // When
    render(<IdentityTheftReportAuthenticationEventIdPage />);

    // Then
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledOnce();
    expect(IdentityTheftReportFormComponent).toHaveBeenCalledWith(
      {
        id: 'IdentityTheftConnection',
      },
      undefined,
    );
  });

  it('should render IdentityTheftReportHelpEventIdAccordionComponent', () => {
    // When
    render(<IdentityTheftReportAuthenticationEventIdPage />);

    // Then
    expect(IdentityTheftReportHelpEventIdAccordionComponent).toHaveBeenCalledOnce();
    expect(IdentityTheftReportHelpEventIdAccordionComponent).toHaveBeenCalledWith({}, undefined);
  });
});
