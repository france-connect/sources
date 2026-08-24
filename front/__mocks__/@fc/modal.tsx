export const ModalContext = {
  Provider: jest.fn(({ children }) => <div data-mockid="ModalContext.Provider">{children}</div>),
};

export const ModalProvider = jest.fn(({ children }) => (
  <div data-mockid="ModalProvider">{children}</div>
));

export const ModalShellComponent = jest.fn(({ children }) => (
  <div data-mockid="ModalShellComponent">{children}</div>
));

export const ModalHeaderComponent = jest.fn(() => <div data-mockid="ModalHeaderComponent" />);

export const ModalCloseButtonComponent = jest.fn(() => (
  <div data-mockid="ModalCloseButtonComponent" />
));

export const ModalTitleComponent = jest.fn(({ children }) => (
  <div data-mockid="ModalTitleComponent">{children}</div>
));

export const ModalFooterComponent = jest.fn(({ children }) => (
  <div data-mockid="ModalFooterComponent">{children}</div>
));

export const useModal = jest.fn(() => ({
  closeModal: jest.fn(),
  currentModal: null,
  openModal: jest.fn(),
}));
