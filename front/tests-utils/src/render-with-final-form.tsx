/* istanbul ignore file */

// declarative file
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

export * from '@testing-library/react-hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderWithFinalForm = (Component: any) => {
  const Wrapper = ({ children }: { children: React.ReactElement }) => (
    <Form onSubmit={jest.fn()}>
      {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
    </Form>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return render(<Component />, { wrapper: Wrapper as any });
};
