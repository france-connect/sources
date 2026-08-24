import { fireEvent, render, screen } from '@testing-library/react';

import { ConfigService } from '@fc/config';
import { t } from '@fc/i18n';

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
    'test-modal': {
      component: RegistryComponentMock,
      title: 'any-title-key-mock',
    },
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
    expect(RegistryComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Test label',
        onClose: expect.any(Function),
      }),
      undefined,
    );
  });

  it('should render the registry title into the shell', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('any-translated-title-mock');

    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(t).toHaveBeenCalledWith('any-title-key-mock');

    const title = screen.getByRole('heading', { name: 'any-translated-title-mock' });

    expect(title).toHaveClass('fr-modal__title');
    expect(title).toHaveAttribute('id', 'test-modal-title');
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'test-modal-title');
  });

  it('should render the registry footer as a sibling of the modal content', () => {
    // Given
    const RegistryFooterComponentMock = jest.fn(
      ({ label, onClose }: { label: string; onClose: () => void }) => (
        <button data-testid="registry-footer" type="button" onClick={onClose}>
          {label}
        </button>
      ),
    );
    jest.mocked(ConfigService.get).mockReturnValue({
      registry: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'test-modal': {
          component: RegistryComponentMock,
          footer: RegistryFooterComponentMock,
          title: 'any-title-key-mock',
        },
      },
    });

    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(RegistryFooterComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Test label',
        onClose: expect.any(Function),
      }),
      undefined,
    );

    const footer = screen.getByTestId('registry-footer').parentElement;

    expect(footer).toHaveClass('fr-modal__footer');
    expect(footer!.parentElement).toHaveClass('fr-modal__body');
    expect(screen.getByTestId('registry-label').closest('.fr-modal__content')).toBeInTheDocument();
  });

  it('should not render a modal footer when the registry entry has none', () => {
    // When
    const { baseElement } = render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));

    // Then
    expect(baseElement.querySelector('.fr-modal__footer')).toBeNull();
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
      'another-modal': {
        component: AnotherRegistryComponentMock,
        title: 'any-another-title-key-mock',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'test-modal': {
        component: RegistryComponentMock,
        title: 'any-title-key-mock',
      },
    };
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

  it('should close modal from shell close button', () => {
    // When
    render(
      <ModalProvider>
        <ContextReader />
      </ModalProvider>,
    );
    fireEvent.click(screen.getByTestId('open-modal'));
    fireEvent.click(screen.getByTestId('test-modal-close-button'));

    // Then
    expect(screen.getByTestId('current-modal-id')).toHaveTextContent('none');
  });
});
