import { render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import { AccordionComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { IdentityTheftReportHelpEventIdAccordionComponent } from './identity-theft-report-help-event-id-accordion.component';

describe('IdentityTheftReportHelpEventIdAccordionComponent', () => {
  // Given
  const toggleFuncMock = jest.fn() as unknown as () => void;
  const toggleValueMock = Symbol('any-boolean') as unknown as boolean;

  beforeEach(() => {
    // Given
    jest.mocked(useToggle).mockReturnValue([toggleValueMock, toggleFuncMock, jest.fn()]);
    jest
      .mocked(t)
      .mockReturnValueOnce('any-i18n-title-mock')
      .mockReturnValueOnce('any-i18n-description-mock');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportHelpEventIdAccordionComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call t 2 times with correct params', () => {
    // When
    render(<IdentityTheftReportHelpEventIdAccordionComponent />);

    // Then
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenNthCalledWith(1, 'IdentityTheftReport.code.title');
    expect(t).toHaveBeenNthCalledWith(2, 'IdentityTheftReport.code.description');
  });

  it('should call AccordionComponent with params', () => {
    // When
    render(<IdentityTheftReportHelpEventIdAccordionComponent />);

    // Then
    expect(AccordionComponent).toHaveBeenCalledOnce();
    expect(AccordionComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        className: 'fr-mt-8w',
        onClick: toggleFuncMock,
        opened: toggleValueMock,
        title: 'any-i18n-title-mock',
      },
      undefined,
    );
  });

  it('should render the accordion text', () => {
    // When
    const { getByText } = render(<IdentityTheftReportHelpEventIdAccordionComponent />);
    const textElt = getByText('any-i18n-description-mock');

    // Then
    expect(textElt).toBeInTheDocument();
  });

  it('should render the image', () => {
    // When
    const { getByRole } = render(<IdentityTheftReportHelpEventIdAccordionComponent />);
    const imgElt = getByRole('img');

    // Then
    expect(imgElt).toBeInTheDocument();
    expect(imgElt).toHaveAttribute('class', 'fr-responsive-img fr-mt-2w');
    expect(imgElt).toHaveAttribute('alt', 'any-i18n-title-mock');
    expect(imgElt).toHaveAttribute('src', '/images/fraud/mail-notification-connexion.png');
  });
});
