import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

import { BadgeComponent } from '@fc/dsfr';

import { ServiceProviderStatusColors } from '../../enums';
import { ServiceProvidersListItemDetailComponent } from '../service-providers-list-item-detail';
import { ServiceProvidersListItemComponent } from './service-providers-list-item.component';

jest.mock('@fc/dsfr');
jest.mock('./../service-providers-list-item-detail/service-providers-list-item-detail.component');

describe('ServiceProvidersListItemDetailComponent', () => {
  it('should match the snapshot with default values for desktop viewport', () => {
    // when
    const { container } = render(
      <ServiceProvidersListItemComponent
        color={ServiceProviderStatusColors.REVIEW_REQUESTED}
        createdAt="23/02/2022"
        datapassId="123"
        organisationName="Direction Interministérielle du Numérique"
        platformName="FranceConnect"
        spName="Portail des demandes de badges Ségur-Fontenoy"
        status="EN INTEGRATION"
        url="/edit"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with default values for mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);

    // when
    const { container } = render(
      <ServiceProvidersListItemComponent
        color={ServiceProviderStatusColors.REVIEW_REQUESTED}
        createdAt="23/02/2022"
        datapassId="123"
        organisationName="Direction Interministérielle du Numérique"
        platformName="FranceConnect"
        spName="Portail des demandes de badges Ségur-Fontenoy"
        status="EN INTEGRATION"
        url="/edit"
      />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have call useMediaQuery with breakpoint mobile query', () => {
    // when
    render(
      <ServiceProvidersListItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
        url="/edit"
      />,
    );

    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ minWidth: 576 });
  });

  it('should have render BadgeComponent mock', () => {
    // when
    render(
      <ServiceProvidersListItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
        url="/edit"
      />,
    );

    // then
    expect(BadgeComponent).toHaveBeenCalledTimes(1);
  });

  it('should have render ServiceProvidersListItemDetailComponent mock', () => {
    // when
    render(
      <ServiceProvidersListItemComponent
        color="color"
        createdAt="createdAt"
        datapassId="datapassId"
        organisationName="organisation"
        platformName="platformName"
        spName="spName"
        status="status"
        url="/edit"
      />,
    );

    // then
    expect(ServiceProvidersListItemDetailComponent).toHaveBeenCalledTimes(4);
  });
});
