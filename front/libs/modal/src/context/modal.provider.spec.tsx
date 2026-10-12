import { fireEvent, render, screen } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { ModalOptions } from '../enums';
import { useModal } from '../hooks';
import type { ModalRegistryInterface } from '../interfaces';
import { ModalProvider } from './modal.provider';

jest.unmock('@fc/common');

describe('ModalProvider', () => {
  const RegistryComponentMock = jest.fn(
    ({ label, onClose }: { label: string; onClose: () => void }) => (
      <div>
        <span data-testid="registry-label">{label}</span>
        <button data-testid="registry-close" type="button" onClick={onClose}>
          Close registry
        </button>
      </div>
    ),
  );

  const registry: ModalRegistryInterface = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'test-modal': RegistryComponentMock,
  };

  const ContextReader = () => {
    const { closeModal, currentModal, openModal } = useModal();

    return (
      <div>
        <button
          data-testid="open-modal"
          type="button"
          onClick={() => openModal('test-modal', { label: 'Test label' })}>
          Open
        </button>
        <button data-testid="close-modal" type="button" onClick={closeModal}>
          Close
        </button>
        <span data-testid="current-modal-id">{currentModal?.id ?? 'none'}</span>
      </div>
    );
  };

  const ContextReaderWithTwoModals = () => {
    const { currentModal, openModal } = useModal();

    return (
      <div>
        <button
          data-testid="open-test-modal"
          type="button"
          onClick={() => openModal('test-modal', { label: 'Test label' })}>
          Open test
        </button>
        <button
          data-testid="open-another-modal"
          type="button"
          onClick={() => openModal('another-modal', { label: 'Another label' })}>
          Open another
        </button>
        <span data-testid="current-modal-id">{currentModal?.id ?? 'none'}</span>
      </div>
    );
  };

  beforeEach(() => {
    jest.mocked(ConfigService.get).mockReturnValue({ registry });
  });

  it('should retrieve modal config from ConfigService', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );

    // Then
    expect(ConfigService.get).toHaveBeenCalledOnce();
    expect(ConfigService.get).toHaveBeenCalledWith(ModalOptions.CONFIG_NAME);
  });

  it('should render children without modal initially', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('none');
    expect(screen.queryByTestId('registry-label')).not.toBeInTheDocument();
  });

  it('should open modal through context', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('test-modal');
    expect(screen.getByTestId('registry-label')).toHaveTextContent('Test label');
  });

  it('should render the registry component with its own props, the registry key and the close callback', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(RegistryComponentMock).toHaveBeenCalledWith(
      {
        id: 'test-modal',
        label: 'Test label',
        onClose: expect.any(Function),
      },
      undefined,
    );
  });

  it('should not render any shell around the registry component', () => {
    // When
    const { baseElement } = render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(baseElement.querySelector('.fr-modal')).toBeNull();
  });

  it('should not open a modal which is not declared into the registry', () => {
    // Given
    jest.mocked(ConfigService.get).mockReturnValueOnce({ registry: {} });

    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('none');
    expect(RegistryComponentMock).not.toHaveBeenCalled();
  });

  it('should replace current modal when opening another one', () => {
    // Given
    const AnotherRegistryComponentMock = jest.fn(({ label }: { label: string }) => (
      <span data-testid="another-registry-label">{label}</span>
    ));
    const registryWithTwoModals: ModalRegistryInterface = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'another-modal': AnotherRegistryComponentMock,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'test-modal': RegistryComponentMock,
    };
    // @NOTE not mockReturnValueOnce: ModalProvider reads the config on every render,
    // and this test re-renders on click — the registry must hold for both calls
    jest.mocked(ConfigService.get).mockReturnValue({ registry: registryWithTwoModals });

    // When
    render(
      <ModalProvider>
        <ContextReaderWithTwoModals />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-test-modal'));
    fireEvent.click(screen.getByTestId('open-another-modal'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('another-modal');
    expect(screen.queryByTestId('registry-label')).not.toBeInTheDocument();
    expect(screen.getByTestId('another-registry-label')).toHaveTextContent('Another label');
  });

  it('should close modal through context', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));
    fireEvent.click(screen.getByTestId('close-modal'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('none');
    expect(screen.queryByTestId('registry-label')).not.toBeInTheDocument();
  });

  it('should close modal from the injected close callback', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));
    fireEvent.click(screen.getByTestId('registry-close'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('none');
  });
});
