import { RenderOptions, render } from '@testing-library/react';
import { PropsWithChildren, ReactElement } from 'react';
import { Form } from 'react-final-form';

const FinalFormWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Form onSubmit={jest.fn()}>
      {({ handleSubmit }) => (
        <form data-testid="form-wrapper" onSubmit={handleSubmit}>
          {children}
        </form>
      )}
    </Form>
  );
};

export const renderWithFinalForm = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: FinalFormWrapper, ...options });
