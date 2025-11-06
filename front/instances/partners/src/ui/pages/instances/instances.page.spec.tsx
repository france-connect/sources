import { render } from '@testing-library/react';

import { type MessageTypes, useScrollTo } from '@fc/common';
import { CreateInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponent, LinkEmailComponent, TileComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';
import type { InstanceInterface } from '@fc/partners-service-providers';

import type { SubmitTypesMessage } from '../../../enums';
import { useInstances } from '../../../hooks';
import { InstancesPage } from './instances.page';

jest.mock('../../../hooks/instances/instances-page.hook');

describe('InstancesPage', () => {
  // Given
  const scrollToTopMock = jest.fn();
  const closeAlertHandlerMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useScrollTo).mockReturnValue({
      scrollToTop: scrollToTopMock,
    });
    jest.mocked(useInstances).mockReturnValue({
      closeAlertHandler: closeAlertHandlerMock,
      hasItems: false,
      items: [],
      submitState: undefined,
    });
    jest.mocked(t).mockReturnValue('any');
  });

  it('should match snapshot, when items are empties', () => {
    // Given
    jest
      .mocked(t)
      .mockReturnValueOnce('any-sandbox_title')
      .mockReturnValueOnce('any-baseline')
      .mockReturnValueOnce('any-create_tile_desc')
      .mockReturnValueOnce('any-create_tile_title');

    // When
    const { container, getByText } = render(<InstancesPage />);
    const titleElt = getByText('any-sandbox_title');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(titleElt).toHaveAttribute('data-testid', 'instances-page-title');
    expect(TileComponent).toHaveBeenCalledOnce();
    expect(TileComponent).toHaveBeenCalledWith(
      {
        dataTestId: 'instances-page-create-tile',
        description: 'any-create_tile_desc',
        isHorizontal: true,
        link: 'create',
        size: 'lg',
        title: 'any-create_tile_title',
      },
      undefined,
    );
  });

  it('should match snapshot, when items are not empties', () => {
    // Given
    const itemsMock = Symbol('any-items-list') as unknown as InstanceInterface[];
    jest.mocked(useInstances).mockReturnValueOnce({
      closeAlertHandler: closeAlertHandlerMock,
      hasItems: true,
      items: itemsMock,
      submitState: undefined,
    });
    jest.mocked(t).mockReturnValueOnce('any-sandbox_title');

    // When
    const { container, getByText } = render(<InstancesPage />);
    const titleElt = getByText('any-sandbox_title');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(CreateInstanceButton).toHaveBeenCalledOnce();
    expect(CreateInstanceButton).toHaveBeenCalledWith({}, undefined);
    expect(InstancesListComponent).toHaveBeenCalledOnce();
    expect(InstancesListComponent).toHaveBeenCalledWith({ items: itemsMock }, undefined);
  });

  it('should call AlertComponent to display help', () => {
    // When
    const { getByText } = render(<InstancesPage />);
    const firstElt = getByText(
      'Si vous n’aviez pas renseigné de numéro d’habilitation (Datapass), nous vous invitons à créer une nouvelle instance depuis cet espace.',
    );
    const secondElt = getByText(
      /Si vous aviez saisi un numéro de demande d’habilitation, vous pouvez soit contacter le support partenaire à l’adresse/,
    );
    const thirdElt = getByText(/soit créer à nouveau votre instance depuis cet espace./);

    // Then
    expect(firstElt).toBeInTheDocument();
    expect(secondElt).toBeInTheDocument();
    expect(thirdElt).toBeInTheDocument();
    expect(LinkEmailComponent).toHaveBeenCalledExactlyOnceWith(
      {
        email: 'support.partenaires@franceconnect.gouv.fr',
      },
      undefined,
    );
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        children: expect.any(Object),
        title:
          'Vous ne trouvez pas l’instance de votre fournisseur de service, bien que la demande de création ait été faite via Démarches Simplifiées ?',
      },
      undefined,
    );
  });

  it('should match snapshot, when the alert component is displayed', () => {
    // Given
    const itemsMock = Symbol('any-items-list') as unknown as InstanceInterface[];
    const submitStateMock = {
      message: 'any-submit-i18n-message-mock' as SubmitTypesMessage,
      type: 'any-message-type-mock' as MessageTypes.ERROR,
    };
    jest
      .mocked(t)
      .mockReturnValueOnce('any')
      .mockReturnValueOnce('any-baseline-mock')
      .mockReturnValueOnce('any-submit-message-mock');
    jest.mocked(useInstances).mockReturnValueOnce({
      closeAlertHandler: closeAlertHandlerMock,
      hasItems: true,
      items: itemsMock,
      submitState: submitStateMock,
    });

    // When
    const { container } = render(<InstancesPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledTimes(2);
    expect(AlertComponent).toHaveBeenNthCalledWith(
      2,
      {
        dataTestId: 'instances-page-alert-top',
        onClose: closeAlertHandlerMock,
        title: 'any-submit-message-mock',
        type: 'any-message-type-mock',
      },
      undefined,
    );
    expect(scrollToTopMock).toHaveBeenCalledOnce();
  });
});
