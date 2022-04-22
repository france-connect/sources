/* istanbul ignore file */

// declarative file
export interface AuthRouteProps {
  strict?: boolean | undefined;
  path?: string | string[] | undefined;
  exact?: boolean | undefined;
  component: React.ElementType;
  loader?: React.ElementType;
  authRedirect: string;
}
