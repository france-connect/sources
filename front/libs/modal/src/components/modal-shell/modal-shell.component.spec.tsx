import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { HeadingTag } from '@fc/common';

import { useModalShell } from '../../hooks';
import { ModalFooterComponent } from '../modal-footer';
import { ModalHeaderComponent } from '../modal-header';
import { ModalTitleComponent } from '../modal-title';
import { ModalShellComponent } from './modal-shell.component';

jest.mock('../../hooks/use-modal-shell/use-modal-shell.hook');
jest.mock('../modal-footer/modal-footer.component');
jest.mock('../modal-header/modal-header.component');
jest.mock('../modal-title/modal-title.component');

describe('ModalShellComponent', () => {
  const handleCancelMock = jest.fn();
  const dialogRefMock = createRef<HTMLDialogElement>();

  beforeEach(() => {
    jest.mocked(useModalShell).mockReturnValueOnce({
      dialogRef: dialogRefMock,
      handleCancel: handleCancelMock,
      resolvedTitleId: 'any-resolved-title-id-mock',
    });
  });

  it('should match the snapshot', () => {
    // When
    render(
      <ModalShellComponent
        dataTestId="any-modal-testid-mock"
        footer={<span>any-footer-mock</span>}
        id="any-modal-id-mock"
        title="any-title-mock"
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(document.body).toMatchSnapshot();
  });

  it('should call useModalShell with the modal identifiers and the close callback', () => {
    // Given
    const onCloseMock = jest.fn();

    // When
    render(
      <ModalShellComponent id="any-modal-id-mock" titleId="any-title-id-mock" onClose={onCloseMock}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(useModalShell).toHaveBeenCalledOnce();
    expect(useModalShell).toHaveBeenCalledWith({
      id: 'any-modal-id-mock',
      onClose: onCloseMock,
      titleId: 'any-title-id-mock',
    });
  });

  it('should render a DSFR opened dialog into the document body', () => {
    // When
    render(
      <ModalShellComponent
        dataTestId="any-modal-testid-mock"
        id="any-modal-id-mock"
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    const element = screen.getByTestId('any-modal-testid-mock');

    expect(element.tagName).toBe('DIALOG');
    expect(element.parentElement).toBe(document.body);
    expect(element).toHaveClass('fr-modal', 'fr-modal--opened');
    expect(element).toHaveAttribute('id', 'any-modal-id-mock');
    expect(screen.getByText('any-children-mock')).toBeInTheDocument();
  });

  it('should render the header with the close callback', () => {
    // Given
    const onCloseMock = jest.fn();

    // When
    render(
      <ModalShellComponent id="any-modal-id-mock" onClose={onCloseMock}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(ModalHeaderComponent).toHaveBeenCalledOnce();
    expect(ModalHeaderComponent).toHaveBeenCalledWith(
      { id: 'any-modal-id-mock', onClose: onCloseMock },
      undefined,
    );
  });

  it('should not render the title nor the footer when they are not provided', () => {
    // When
    render(
      <ModalShellComponent
        dataTestId="any-modal-testid-mock"
        id="any-modal-id-mock"
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(ModalTitleComponent).not.toHaveBeenCalled();
    expect(ModalFooterComponent).not.toHaveBeenCalled();
    expect(screen.getByTestId('any-modal-testid-mock')).not.toHaveAttribute('aria-labelledby');
  });

  it('should render the title with the default heading level and label the dialog', () => {
    // When
    render(
      <ModalShellComponent
        dataTestId="any-modal-testid-mock"
        id="any-modal-id-mock"
        title="any-title-mock"
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(ModalTitleComponent).toHaveBeenCalledOnce();
    expect(ModalTitleComponent).toHaveBeenCalledWith(
      {
        children: 'any-title-mock',
        heading: HeadingTag.H1,
        id: 'any-resolved-title-id-mock',
      },
      undefined,
    );
    expect(screen.getByTestId('any-modal-testid-mock')).toHaveAttribute(
      'aria-labelledby',
      'any-resolved-title-id-mock',
    );
  });

  it('should render the title with the provided heading level', () => {
    // When
    render(
      <ModalShellComponent
        id="any-modal-id-mock"
        title="any-title-mock"
        titleHeading={HeadingTag.H2}
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(ModalTitleComponent).toHaveBeenCalledOnce();
    expect(ModalTitleComponent).toHaveBeenCalledWith(
      expect.objectContaining({ heading: HeadingTag.H2 }),
      undefined,
    );
  });

  it('should render the footer when provided', () => {
    // Given
    const footer = <span>any-footer-mock</span>;

    // When
    render(
      <ModalShellComponent footer={footer} id="any-modal-id-mock" onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // Then
    expect(ModalFooterComponent).toHaveBeenCalledOnce();
    expect(ModalFooterComponent).toHaveBeenCalledWith({ children: footer }, undefined);
    expect(screen.getByText('any-footer-mock')).toBeInTheDocument();
  });

  it('should call handleCancel when the dialog cancel event is triggered', () => {
    // Given
    render(
      <ModalShellComponent
        dataTestId="any-modal-testid-mock"
        id="any-modal-id-mock"
        onClose={jest.fn()}>
        any-children-mock
      </ModalShellComponent>,
    );

    // When
    fireEvent(
      screen.getByTestId('any-modal-testid-mock'),
      new Event('cancel', { bubbles: true, cancelable: true }),
    );

    // Then
    expect(handleCancelMock).toHaveBeenCalledOnce();
  });
});
