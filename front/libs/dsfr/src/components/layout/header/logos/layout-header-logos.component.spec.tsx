import { render } from '@testing-library/react';

import { LayoutHomepageLinkComponent } from '../../homepage-link';
import { LayoutHeaderLogosComponent } from './layout-header-logos.component';

jest.mock('../../../logos/logo-republique-francaise.component');
jest.mock('./../../homepage-link/layout-homepage-link.component');

describe('LayoutHeaderLogosComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderLogosComponent title="any-title" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call LayoutHomepageLinkComponent with props', () => {
    // when
    render(<LayoutHeaderLogosComponent title="any-title-mock" />);

    // then
    expect(LayoutHomepageLinkComponent).toHaveBeenCalledTimes(1);
  });

  it('should render the brand logo with an alt param', () => {
    // when
    const { getByAltText } = render(
      <LayoutHeaderLogosComponent logo={expect.any(String)} title="any-title-mock" />,
    );
    const element = getByAltText('any-title-mock');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should match snapshot when application logo is defined', () => {
    // when
    const { container } = render(
      <LayoutHeaderLogosComponent logo={expect.any(String)} title="any-title-mock" />,
    );

    // then
    expect(container).toMatchSnapshot();
  });
});
