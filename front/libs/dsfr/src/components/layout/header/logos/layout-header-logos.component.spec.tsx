import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { LayoutHeaderLogosComponent } from './layout-header-logos.component';

jest.mock('../../../logos/logo-republique-francaise.component');

describe('LayoutHeaderLogosComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<LayoutHeaderLogosComponent />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call react router Link with props', () => {
    // when
    render(<LayoutHeaderLogosComponent title="any-title-mock" />);

    // then
    expect(Link).toHaveBeenCalledTimes(1);
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Accueil - any-title-mock',
        to: '/',
      }),
      {},
    );
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
    const { container } = render(<LayoutHeaderLogosComponent logo={expect.any(String)} />);

    // then
    expect(container).toMatchSnapshot();
  });
});
