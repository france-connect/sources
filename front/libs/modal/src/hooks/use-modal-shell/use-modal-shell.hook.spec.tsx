import { fireEvent, render, renderHook, screen } from '@testing-library/react';

import { useModalShell } from './use-modal-shell.hook';

function ModalShellHarness({ onClose, titleId }: { onClose: () => void; titleId?: string }) {
  const { dialogRef, handleCancel, resolvedTitleId } = useModalShell({
    id: 'test-modal',
    onClose,
    titleId,
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={resolvedTitleId}
      data-testid="modal-dialog"
      onCancel={handleCancel}>
      <span data-testid="modal-inner-content">Content</span>
    </dialog>
  );
}

describe('useModalShell', () => {
  // @NOTE the spies are set on HTMLDialogElement.prototype (jsdom polyfill),
  // they must be restored between tests otherwise the polyfill stays mocked.
  // To be replaced by `restoreMocks: true` into the jest config,
  // which today breaks two unit tests of the project.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should resolve titleId from id when titleId is not provided', () => {
    // When
    const { result } = renderHook(() => useModalShell({ id: 'test-modal', onClose: jest.fn() }));

    // Then
    expect(result.current.resolvedTitleId).toBe('test-modal-title');
  });

  it('should use provided titleId', () => {
    // When
    const { result } = renderHook(() =>
      useModalShell({
        id: 'test-modal',
        onClose: jest.fn(),
        titleId: 'custom-title-id',
      }),
    );

    // Then
    expect(result.current.resolvedTitleId).toBe('custom-title-id');
  });

  it('should call showModal on mount', () => {
    // Given
    const showModalSpy = jest.spyOn(HTMLDialogElement.prototype, 'showModal');

    // When
    render(<ModalShellHarness onClose={jest.fn()} />);

    // Then
    expect(showModalSpy).toHaveBeenCalledOnce();
  });

  it('should call onClose when handleCancel is triggered', () => {
    // Given
    const onCloseMock = jest.fn();
    render(<ModalShellHarness onClose={onCloseMock} />);
    const dialog = screen.getByTestId('modal-dialog');

    // When
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));

    // Then
    expect(onCloseMock).toHaveBeenCalledOnce();
  });

  it('should call onClose when backdrop is clicked', () => {
    // Given
    const onCloseMock = jest.fn();
    render(<ModalShellHarness onClose={onCloseMock} />);

    // When
    fireEvent.click(screen.getByTestId('modal-dialog'));

    // Then
    expect(onCloseMock).toHaveBeenCalledOnce();
  });

  it('should not call onClose when modal content is clicked', () => {
    // Given
    const onCloseMock = jest.fn();
    render(<ModalShellHarness onClose={onCloseMock} />);

    // When
    fireEvent.click(screen.getByTestId('modal-inner-content'));

    // Then
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('should not call showModal when the dialog is already open', () => {
    // Given
    const showModalSpy = jest.spyOn(HTMLDialogElement.prototype, 'showModal');
    jest.spyOn(HTMLDialogElement.prototype, 'open', 'get').mockReturnValueOnce(true);

    // When
    render(<ModalShellHarness onClose={jest.fn()} />);

    // Then
    expect(showModalSpy).not.toHaveBeenCalled();
  });

  it('should close dialog on unmount', () => {
    // Given
    const closeSpy = jest.spyOn(HTMLDialogElement.prototype, 'close');

    // When
    const { unmount } = render(<ModalShellHarness onClose={jest.fn()} />);
    unmount();

    // Then
    expect(closeSpy).toHaveBeenCalledOnce();
  });

  it('should not call close on unmount when the dialog is already closed', () => {
    // Given
    const closeSpy = jest.spyOn(HTMLDialogElement.prototype, 'close');
    const { unmount } = render(<ModalShellHarness onClose={jest.fn()} />);
    (screen.getByTestId('modal-dialog') as HTMLDialogElement).close();
    closeSpy.mockClear();

    // When
    unmount();

    // Then
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should keep the same handlers when the onClose callback changes', () => {
    // Given
    const { rerender, result } = renderHook<
      ReturnType<typeof useModalShell>,
      { onClose: () => void }
    >(({ onClose }) => useModalShell({ id: 'test-modal', onClose }), {
      initialProps: { onClose: jest.fn() },
    });
    const initialHandleCancel = result.current.handleCancel;

    // When
    rerender({ onClose: jest.fn() });

    // Then
    expect(result.current.handleCancel).toBe(initialHandleCancel);
  });

  it('should call the latest onClose callback when it has been updated', () => {
    // Given
    const updatedOnCloseMock = jest.fn();
    const { rerender } = render(<ModalShellHarness onClose={jest.fn()} />);

    // When
    rerender(<ModalShellHarness onClose={updatedOnCloseMock} />);
    fireEvent.click(screen.getByTestId('modal-dialog'));

    // Then
    expect(updatedOnCloseMock).toHaveBeenCalledOnce();
  });
});
