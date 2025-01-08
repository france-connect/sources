export interface NavigationLinkInterface extends React.RefAttributes<HTMLAnchorElement> {
  href: string;
  label: string;
  title?: string;
}
