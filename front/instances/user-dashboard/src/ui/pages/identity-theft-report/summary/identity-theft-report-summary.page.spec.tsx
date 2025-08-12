import { render } from '@testing-library/react';

import { TableComponent } from '@fc/dsfr';
import type { BaseAttributes, Dto2FormFormConfigInterface } from '@fc/dto2form';
import { DTO2FormComponent } from '@fc/dto2form';
import { t } from '@fc/i18n';

import { IdentityTheftReportSummaryPage } from './identity-theft-report-summary.page';
import { useSummaryPage } from './summary-page.hook';

jest.mock('./summary-page.hook');

describe('IdentityTheftReportSummaryPage', () => {
  // Given
  const configMock = Symbol('configMock') as unknown as Dto2FormFormConfigInterface;
  const onSubmitMock = jest.fn();
  const onPreSubmitMock = jest.fn();
  const onPostSubmitMock = jest.fn();
  const schemaMock = Symbol('schemaMock') as unknown as BaseAttributes[];
  const valuesMock = {
    connection: {
      code: 'any-connection-code-mock',
    },
    contact: {
      email: 'any-email-mock',
      phone: 'any-phone-mock',
    },
    description: { description: 'any-description-mock' },
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
  const useSummaryPageResultMock = {
    config: configMock,
    onPostSubmit: onPostSubmitMock,
    onPreSubmit: onPreSubmitMock,
    onSubmit: onSubmitMock,
    redirectUrl: null,
    schema: schemaMock,
    values: valuesMock,
  };

  beforeEach(() => {
    // Given
    jest.mocked(useSummaryPage).mockReturnValue(useSummaryPageResultMock);
  });

  it('should match the snapshot', () => {
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

  it('should call DTO2FormComponent with arguments', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('Form.submit.label--mock');

    // When
    render(<IdentityTheftReportSummaryPage />);

    // Then
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('Fraud.IdentityTheftReport.sendReportButton');
    expect(DTO2FormComponent).toHaveBeenCalledExactlyOnceWith({
      config: configMock,
      initialValues: expect.objectContaining({}),
      noRequired: true,
      onPostSubmit: onPostSubmitMock,
      onPreSubmit: onPreSubmitMock,
      onSubmit: onSubmitMock,
      schema: schemaMock,
      submitLabel: 'Form.submit.label--mock',
    });
  });
});
