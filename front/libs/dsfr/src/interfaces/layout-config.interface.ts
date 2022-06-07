import { NavigationLink } from './navigation-link.interface';

export interface LayoutConfig {
  // @TODO should update/refacto exploit apps
  // then will replace `any` type by `string`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any;
  navigationItems?: NavigationLink[];
  bottomLinks: NavigationLink[];
  footerDescription: string;
  footerLinkTitle: string;
}
