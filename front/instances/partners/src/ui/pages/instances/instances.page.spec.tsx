import { render } from '@testing-library/react';

import { type EventTypes, useScrollTo } from '@fc/common';
import {
  CreateInstanceButton,
  type InstanceInterface,
  InstancesListComponent,
} from '@fc/core-partners';
import { AlertComponent, TileComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

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
      .mockReturnValueOnce('any-create_tile_desc')
      .mockReturnValueOnce('any-create_tile_title');

    // When
    const { container, getByText } = render(<InstancesPage />);
    const titleElt = getByText('any-sandbox_title');

    // Then
    expect(container).toMatchSnapshot();
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.homepage.sandboxTitle');
    expect(t).toHaveBeenNthCalledWith(2, 'Partners.homepage.createTileDescription');
    expect(t).toHaveBeenNthCalledWith(3, 'Partners.homepage.createTileTitle');
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
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenNthCalledWith(1, 'Partners.homepage.sandboxTitle');
    expect(titleElt).toBeInTheDocument();
    expect(CreateInstanceButton).toHaveBeenCalledOnce();
    expect(CreateInstanceButton).toHaveBeenCalledWith({}, undefined);
    expect(InstancesListComponent).toHaveBeenCalledOnce();
    expect(InstancesListComponent).toHaveBeenCalledWith({ items: itemsMock }, undefined);
  });

  it('should match snapshot, when the alert component is displayed', () => {
    // Given
    const itemsMock = Symbol('any-items-list') as unknown as InstanceInterface[];
    const submitStateMock = {
      message: 'any-submit-i18n-message-mock' as SubmitTypesMessage,
      type: 'any-submit-type-mock' as EventTypes.ERROR,
    };
    jest.mocked(t).mockReturnValueOnce('any').mockReturnValueOnce('any-submit-message-mock');
    jest.mocked(useInstances).mockReturnValueOnce({
      closeAlertHandler: closeAlertHandlerMock,
      hasItems: true,
      items: itemsMock,
      submitState: submitStateMock,
    });

    // When
    const { container } = render(<InstancesPage />);

    // Then
    expect(t).toHaveBeenNthCalledWith(2, 'any-submit-i18n-message-mock');
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledOnce();
    expect(AlertComponent).toHaveBeenCalledWith(
      {
        className: 'fr-mb-3w',
        dataTestId: 'instances-page-alert-top',
        onClose: closeAlertHandlerMock,
        title: 'any-submit-message-mock',
        type: 'any-submit-type-mock',
      },
      undefined,
    );
    expect(scrollToTopMock).toHaveBeenCalledOnce();
  });
});
