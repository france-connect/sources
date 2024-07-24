/* istanbul ignore file */

// declarative file
export interface NavigationLink extends React.RefAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  title?: string;
}
