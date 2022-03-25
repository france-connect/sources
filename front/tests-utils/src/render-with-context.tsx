/* istanbul ignore file */

// declarative file
import { Context } from 'react';

import { renderHook } from '@testing-library/react-hooks';

export const renderWithContext = (
  hook: Function,
  // @NOTE unable to be more precise than Record<string, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContextElement: Context<any>,
  contextValues = {},
) => {
  const Wrapper = ({ children, value }: { children: React.FunctionComponent; value: unknown }) => (
    <ContextElement.Provider value={value}>{children}</ContextElement.Provider>
  );

  return renderHook(() => hook(), {
    initialProps: {
      children: () => <div />,
      value: contextValues,
    },
    wrapper: Wrapper,
  });
};

export * from '@testing-library/react-hooks';
