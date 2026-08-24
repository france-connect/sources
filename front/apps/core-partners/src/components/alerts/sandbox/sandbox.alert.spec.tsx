import { render } from '@testing-library/react';
import { useLocation } from 'react-router';

import { MessageTypes } from '@fc/common';
import { AlertComponent } from '@fc/dsfr';
import { useCleanupRouteState } from '@fc/routing';

import { PartnersAlertVariants } from '../../../enums';
import type { LocationWithSubmitStateInterface } from '../../../interfaces';
import { SandboxAlert } from './sandbox.alert';

describe('SandboxAlert', () => {
  // Given
  const cleanupRouteStateMock = jest.fn();
  const titleMock = 'any-translated-title-mock';
  const messageMock = 'any-translated-message-mock';

  beforeEach(() => {
    // Given
    jest
      .mocked(useCleanupRouteState)
      .mockReturnValue({ cleanupRouteState: cleanupRouteStateMock, state: undefined });
  });

  it('should call useCleanupRouteState', () => {
    // When
    render(<SandboxAlert />);

    // Then
    expect(useCleanupRouteState).toHaveBeenCalledExactlyOnceWith();
  });

  it('should call useLocation to key the alert on the current navigation', () => {
    // When
    render(<SandboxAlert />);

    // Then
    expect(useLocation).toHaveBeenCalledExactlyOnceWith();
  });

  it('should not render the AlertComponent when there is no route state', () => {
    // When
    render(<SandboxAlert />);

    // Then
    expect(AlertComponent).not.toHaveBeenCalled();
  });

  it('should not render the AlertComponent when the route state carries a non instance variant', () => {
    // Given
    jest.mocked(useCleanupRouteState).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      state: {
        title: titleMock,
        type: MessageTypes.SUCCESS,
        variant: PartnersAlertVariants.CONTRIBUTOR,
      } as unknown as LocationWithSubmitStateInterface,
    });

    // When
    render(<SandboxAlert />);

    // Then
    expect(AlertComponent).not.toHaveBeenCalled();
  });

  it('should match the snapshot for the instance variant', () => {
    // Given
    jest.mocked(useCleanupRouteState).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      state: {
        title: titleMock,
        type: MessageTypes.SUCCESS,
        variant: PartnersAlertVariants.INSTANCE,
      } as unknown as LocationWithSubmitStateInterface,
    });

    // When
    const { container } = render(<SandboxAlert />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the AlertComponent with the already translated title and message', () => {
    // Given
    jest.mocked(useCleanupRouteState).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      state: {
        message: messageMock,
        title: titleMock,
        type: MessageTypes.SUCCESS,
        variant: PartnersAlertVariants.INSTANCE,
      } as unknown as LocationWithSubmitStateInterface,
    });

    // When
    render(<SandboxAlert />);

    // Then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        autoFocus: true,
        children: messageMock,
        className: 'fr-mb-3w',
        dataTestId: 'service-provider-instance-alert',
        onClose: cleanupRouteStateMock,
        title: titleMock,
        type: MessageTypes.SUCCESS,
      },
      undefined,
    );
  });

  it('should render the AlertComponent with an empty body when there is no message', () => {
    // Given
    jest.mocked(useCleanupRouteState).mockReturnValueOnce({
      cleanupRouteState: cleanupRouteStateMock,
      state: {
        title: titleMock,
        type: MessageTypes.SUCCESS,
        variant: PartnersAlertVariants.INSTANCE,
      } as unknown as LocationWithSubmitStateInterface,
    });

    // When
    render(<SandboxAlert />);

    // Then
    expect(AlertComponent).toHaveBeenCalledExactlyOnceWith(
      {
        autoFocus: true,
        children: '',
        className: 'fr-mb-3w',
        dataTestId: 'service-provider-instance-alert',
        onClose: cleanupRouteStateMock,
        title: titleMock,
        type: MessageTypes.SUCCESS,
      },
      undefined,
    );
  });
});
