import { render } from '@testing-library/react';

import { type MessageTypes, useScrollTo } from '@fc/common';
import type { InstanceInterface, LocationWithSubmitStateInterface } from '@fc/core-partners';
import { CreateUnlinkedInstanceButton, InstancesListComponent } from '@fc/core-partners';
import { AlertComponent, TileComponent } from '@fc/dsfr';
import { t } from '@fc/i18n';

import { useInstances } from '../../../hooks';
import { InstancesPage } from './instances.page';

jest.mock('../../../hooks/instances/instances-page.hook');

describe('InstancesPage', () => {
  // Given
  const scrollToTopMock = jest.fn();
  const cleanupRouteStateMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useScrollTo).mockReturnValue({
      scrollToTop: scrollToTopMock,
    });
    jest.mocked(useInstances).mockReturnValue({
      cleanupRouteState: cleanupRouteStateMock,
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
        link: 'creer-instance',
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
      cleanupRouteState: cleanupRouteStateMock,
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
    expect(CreateUnlinkedInstanceButton).toHaveBeenCalledExactlyOnceWith({}, undefined);
    expect(InstancesListComponent).toHaveBeenCalledOnce();
    expect(InstancesListComponent).toHaveBeenCalledWith({ items: itemsMock }, undefined);
  });

  it('should match snapshot, when the alert component is displayed', () => {
    // Given
    const itemsMock = Symbol('any-items-list') as unknown as InstanceInterface[];
    const submitStateMock = {
      message: 'any-submit-i18n-message-mock',
      title: 'any-submit-i18n-title-mock',
      type: 'any-message-type-mock' as MessageTypes.ERROR | MessageTypes.SUCCESS,
    } as unknown as LocationWithSubmitStateInterface;
    jest
      .mocked(t)
      .mockReturnValueOnce('any')
      .mockReturnValueOnce('any-baseline-mock')
      .mockReturnValueOnce('any-submit-message-mock');
    jest.mocked(useInstances).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      hasItems: true,
      items: itemsMock,
      submitState: submitStateMock,
    });

    // When
    const { container } = render(<InstancesPage />);

    // Then
    expect(container).toMatchSnapshot();
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        dataTestId: 'instances-page-alert-top',
        onClose: cleanupRouteStateMock,
        title: 'any-submit-message-mock',
        type: 'any-message-type-mock',
      },
      undefined,
    );
    expect(scrollToTopMock).toHaveBeenCalledOnce();
  });
});
