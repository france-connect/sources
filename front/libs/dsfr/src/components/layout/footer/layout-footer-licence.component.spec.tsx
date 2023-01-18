import { render } from '@testing-library/react';

import { LayoutFooterLicenceComponent } from './layout-footer-licence.component';

describe('LayoutFooterLicenceComponent', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutFooterLicenceComponent />);

    // then
    expect(container).toMatchSnapshot();
  });
});
