/* istanbul ignore file */

// declarative file
import { ReactElement } from 'react';

interface wrapperArguments<T> {
  children: ReactElement[] | ReactElement;
  props?: T;
}

export const Wrapper = <T>({ children }: wrapperArguments<T>) => children as ReactElement;
