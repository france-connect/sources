import React from 'react';

const ReactModal = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export const Modal = jest.fn(ReactModal);

// @NOTE react-modal can only be used with a default export
// it is a class component
// eslint-disable-next-line import/no-default-export
export default Modal;
