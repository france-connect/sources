import { render } from '@testing-library/react';

import { TrackCardComponent } from '@fc/core-user-dashboard';
import { TableComponent } from '@fc/dsfr';
import type { BaseAttributes, Dto2FormFormConfigInterface } from '@fc/dto2form';
import { Dto2FormComponent } from '@fc/dto2form';
import type { FormConfigInterface } from '@fc/forms';
import { t } from '@fc/i18n';

import { useSummaryPage } from '../../../../hooks';
import { IdentityTheftReportSummaryPage } from './identity-theft-report-summary.page';

jest.mock('../../../../hooks/identity-theft-report/summary/summary-page.hook');

describe('IdentityTheftReportSummaryPage', () => {
  // Given
  const configMock = Symbol('configMock') as unknown as Dto2FormFormConfigInterface;
  const onSubmitMock = jest.fn();
  const onPreSubmitMock = jest.fn();
  const onPostSubmitMock = jest.fn();
  const schemaMock = Symbol('schemaMock') as unknown as BaseAttributes[];
  const summaryMock = {
    connection: {
      code: 'any-connection-code-mock',
    },
    contact: {
      email: 'any-email-mock',
      phone: 'any-phone-mock',
    },
    description: { description: 'any-description-mock' },
    fraudTracks: [
      {
        datetime: 'any-fraud-track-datetime-mock',
        idpName: 'any-idp-name-mock',
        spName: 'any-sp-name-mock',
        trackId: 'any-track-id-mock-1',
      },
      {
        datetime: 'any-fraud-track-datetime-mock',
        idpName: 'any-idp-name-mock',
        spName: 'any-sp-name-mock',
        trackId: 'any-track-id-mock-2',
      },
    ],
    identity: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'any-family_name-mock',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'any-given_name-mock',
      rawBirthcountry: 'any-rawBirthcountry-mock',
      rawBirthdate: 'any-rawBirthdate-mock',
      rawBirthplace: 'any-rawBirthplace-mock',
    },
  };

  beforeEach(() => {
    // Given
    jest.mocked(useSummaryPage).mockReturnValue({
      config: configMock.form as unknown as FormConfigInterface,
      onPostSubmit: onPostSubmitMock,
      onPreSubmit: onPreSubmitMock,
      onSubmit: onSubmitMock,
      schema: schemaMock,
      summary: summaryMock,
    });
    jest.mocked(t).mockReturnValue('any-acme-tracks-translation');
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when tracks is empty', () => {
    // Given
    jest.mocked(useSummaryPage).mockReturnValueOnce({
      ...useSummaryPage(),
      summary: {
        ...summaryMock,
        fraudTracks: [],
      },
    });

    // When
    const { container } = render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should call useSummaryPage hook', () => {
    // When
    render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(useSummaryPage).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call translations 1 times', () => {
    // When
    render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenNthCalledWith(1, 'IdentityTheftReport.summaryPage.tracksTitle');
  });

  it('should call TableComponent 5 times', () => {
    // When
    render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(TableComponent).toHaveBeenCalledTimes(5);
    expect(TableComponent).toHaveBeenNthCalledWith(
      1,
      {
        caption: 'Décrivez votre cas d’usurpation en quelques mots',
        hideHeader: true,
        id: 'identity-theft-report-summary--description',
        multiline: true,
        sources: [{ label: 'any-description-mock' }],
      },
      undefined,
    );
    expect(TableComponent).toHaveBeenNthCalledWith(
      2,
      {
        caption: 'Code d’identification de la connexion frauduleuse',
        hideHeader: true,
        id: 'identity-theft-report-summary--code-identification',
        sources: [{ label: 'any-connection-code-mock' }],
      },
      undefined,
    );
    expect(TableComponent).toHaveBeenNthCalledWith(
      3,
      {
        caption: 'Etat civil',
        hideHeader: true,
        id: 'identity-theft-report-summary--etat-civil',
        sources: [
          { label: 'Nom de naissance', value: 'any-family_name-mock' },
          { label: 'Prénom de naissance', value: 'any-given_name-mock' },
          { label: 'Date de naissance', value: 'any-rawBirthdate-mock' },
          { label: 'Pays de naissance', value: 'any-rawBirthcountry-mock' },
          { label: 'Ville de naissance', value: 'any-rawBirthplace-mock' },
        ],
      },
      undefined,
    );
    expect(TableComponent).toHaveBeenNthCalledWith(
      4,
      {
        caption: 'Adresse électronique',
        hideHeader: true,
        id: 'identity-theft-report-summary--email',
        sources: [{ label: 'any-email-mock' }],
      },
      undefined,
    );
    expect(TableComponent).toHaveBeenNthCalledWith(
      5,
      {
        caption: 'Numéro de téléphone',
        hideHeader: true,
        id: 'identity-theft-report-summary--phone',
        sources: [{ label: 'any-phone-mock' }],
      },
      undefined,
    );
  });

  it('should call Dto2FormComponent with arguments', () => {
    // When
    render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(Dto2FormComponent).toHaveBeenCalledExactlyOnceWith({
      config: configMock.form,
      initialValues: expect.objectContaining({}),
      onPostSubmit: onPostSubmitMock,
      onPreSubmit: onPreSubmitMock,
      onSubmit: onSubmitMock,
      schema: schemaMock,
    });
  });

  it('should render tracks', () => {
    // When
    const { getByText } = render(<IdentityTheftReportSummaryPage />);
    const tracksTitleElt = getByText('any-acme-tracks-translation');

    // Then
    expect(tracksTitleElt).toBeInTheDocument();
    expect(TrackCardComponent).toHaveBeenCalledTimes(2);
    expect(TrackCardComponent).toHaveBeenNthCalledWith(
      1,
      { track: summaryMock.fraudTracks[0] },
      undefined,
    );
    expect(TrackCardComponent).toHaveBeenNthCalledWith(
      2,
      { track: summaryMock.fraudTracks[1] },
      undefined,
    );
  });

  it('should not render tracks when tracks is empty', () => {
    // Given
    jest.mocked(useSummaryPage).mockReturnValueOnce({
      ...useSummaryPage(),
      summary: {
        ...summaryMock,
        fraudTracks: [],
      },
    });

    // When
    const { getByText } = render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(() => getByText('any-acme-tracks-translation')).toThrow();
    expect(TrackCardComponent).not.toHaveBeenCalled();
  });

  describe('when phone is undefined', () => {
    beforeEach(() => {
      // Given
      jest
        .mocked(t)
        .mockReturnValueOnce('any-acme-phone-translation')
        .mockReturnValueOnce('any-acme-tracks-translation');
      jest.mocked(useSummaryPage).mockReturnValueOnce({
        config: configMock.form as unknown as FormConfigInterface,
        onPostSubmit: onPostSubmitMock,
        onPreSubmit: onPreSubmitMock,
        onSubmit: onSubmitMock,
        schema: schemaMock,
        summary: {
          ...summaryMock,
          contact: {
            ...summaryMock.contact,
            phone: undefined,
          },
        },
      });
    });

    it('should call translations 2 times', () => {
      // When
      render(<IdentityTheftReportSummaryPage />);

      // Then
      expect(t).toHaveBeenCalledTimes(2);
      expect(t).toHaveBeenNthCalledWith(1, 'FC.Common.notAvailable');
      expect(t).toHaveBeenNthCalledWith(2, 'IdentityTheftReport.summaryPage.tracksTitle');
    });

    it('should call translation function if phone is undefined', () => {
      // When
      render(<IdentityTheftReportSummaryPage />);

      // Then
      expect(t).toHaveBeenNthCalledWith(1, 'FC.Common.notAvailable');
    });

    it('should render the 5th TableComponent with params if phone is undefined', () => {
      // When
      render(<IdentityTheftReportSummaryPage />);

      // Then
      expect(TableComponent).toHaveBeenNthCalledWith(
        5,
        {
          caption: 'Numéro de téléphone',
          hideHeader: true,
          id: 'identity-theft-report-summary--phone',
          sources: [{ label: 'any-acme-phone-translation' }],
        },
        undefined,
      );
    });
  });
});
