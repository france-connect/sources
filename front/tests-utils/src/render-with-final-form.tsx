/* istanbul ignore file */

// declarative file
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

export * from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderWithFinalForm = (Component: any, props: any) => {
  const Wrapper = ({ children }: { children: React.ReactElement }) => (
    <Form onSubmit={jest.fn()}>
      {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
    </Form>
  );
  return render(
    // eslint-disable-next-line  react/jsx-props-no-spreading
    <Component {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { wrapper: Wrapper as any },
  );
};
