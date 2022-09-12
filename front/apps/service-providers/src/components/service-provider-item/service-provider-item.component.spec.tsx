import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useMediaQuery } from 'react-responsive';

import { BadgeComponent } from '@fc/dsfr';
import { ServiceProviderStatusColors } from '@fc/partners';

import { ServiceProviderItemComponent } from './service-provider-item.component';
import { ServiceProviderItemDetailComponent } from './service-provider-item-detail.component';

jest.mock('@fc/dsfr');
jest.mock('@fc/partners');
jest.mock('./service-provider-item-detail.component');

describe('ServiceProviderItemDetailComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with default values for desktop viewport', () => {
    // when
    const { container } = render(
      <ServiceProviderItemComponent
        color={ServiceProviderStatusColors.REVIEW_REQUESTED}
        createdAt="23/02/2022"
        datapassId="123"
        organisationName="Direction Interministérielle du Numérique"
        platformName="FranceConnect"
        spName="Portail des demandes de badges Ségur-Fontenoy"
        status="EN INTEGRATION"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with default values for mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(
      <ServiceProviderItemComponent
        color={ServiceProviderStatusColors.REVIEW_REQUESTED}
        createdAt="23/02/2022"
        datapassId="123"
        organisationName="Direction Interministérielle du Numérique"
        platformName="FranceConnect"
        spName="Portail des demandes de badges Ségur-Fontenoy"
        status="EN INTEGRATION"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have call useMediaQuery with breakpoint mobile query', () => {
    // when
    render(
      <ServiceProviderItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
      />,
    );

    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ minWidth: 576 });
  });

  it('should have render BadgeComponent mock', () => {
    // when
    render(
      <ServiceProviderItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
      />,
    );

    // then
    expect(BadgeComponent).toHaveBeenCalledTimes(1);
  });

  it('should have render ServiceProviderItemDetailComponent mock', () => {
    // when
    render(
      <ServiceProviderItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
      />,
    );

    // then
    expect(ServiceProviderItemDetailComponent).toHaveBeenCalledTimes(4);
  });
});
