import { createRef } from 'react';

export const useModalShell = jest.fn(() => ({
  dialogRef: createRef<HTMLDialogElement>(),
  handleCancel: jest.fn(),
  resolvedTitleId: 'useModalShell.resolvedTitleId.mock',
}));
