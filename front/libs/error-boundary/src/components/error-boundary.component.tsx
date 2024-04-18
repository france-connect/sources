import type { ReactNode } from 'react';
import React from 'react';

export interface ErrorBoundaryComponentState {
  error: Error | null;
}

export interface ErrorBoundaryComponentProps {
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: ReactNode;
}

export class ErrorBoundaryComponent extends React.Component<
  ErrorBoundaryComponentProps,
  ErrorBoundaryComponentState
> {
  static INTERCEPTOR: unknown;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  constructor(props: ErrorBoundaryComponentProps) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const { onError } = this.props;
    if (onError) {
      onError(error, info);
    }
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (!error) {
      return children;
    }

    return <h1>ErrorBoundaryComponent: Something went wrong.</h1>;
  }
}
