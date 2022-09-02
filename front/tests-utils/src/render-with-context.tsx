/* istanbul ignore file */

// declarative file
import { renderHook } from '@testing-library/react';
import { Context, ReactElement } from 'react';

export const renderWithContext = (
  hook: Function,
  // @NOTE unable to be more precise than Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContextElement: Context<any>,
  contextValues = {},
) => {
  const Wrapper = ({ children }: { children: ReactElement | ReactElement[] }) => (
    <ContextElement.Provider value={contextValues}>{children}</ContextElement.Provider>
  );

  return renderHook(() => hook(), {
    initialProps: {
      children: () => <div />,
    },
    wrapper: Wrapper,
  });
};

export * from '@testing-library/react';
