/* istanbul ignore file */

// declarative file
import type { SVGComponentInterface } from '@fc/assets';

export interface LayoutServiceInterface {
  name?: string;
  homepage: string;
  baseline?: string;
  logo: SVGComponentInterface;
}
