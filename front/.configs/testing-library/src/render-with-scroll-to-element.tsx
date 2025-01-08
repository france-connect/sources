import { renderHook } from '@testing-library/react';

const Wrapper = ({ children, className }: { className: string; children: React.ReactNode }) => (
  // @TODO
  // fix HTML structure
  // scroll-to-element should not be depending on how many children
  <div>
    <div>
      <div className={className}>{children}</div>
    </div>
  </div>
);

export const renderWithScrollToElement = (hook: Function, className: string) =>
  renderHook(() => hook(), {
    initialProps: { children: () => 'Mock Element' },
    wrapper: ({ children }) => Wrapper({ children, className }),
  });
