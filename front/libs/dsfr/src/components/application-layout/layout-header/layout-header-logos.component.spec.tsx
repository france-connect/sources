import { Link } from 'react-router-dom';

import { renderWithRouter } from '@fc/tests-utils';

import { LogoMarianneComponent } from '../../assets/logo-marianne.component';
import { LayoutHeaderLogosComponent } from './layout-header-logos.component';

jest.mock('react-router-dom');
jest.mock('../../assets/logo-marianne.component');

describe('LayoutHeaderLogosComponent', () => {
  // given
  const LogoMock = jest.fn(() => <div>LogoMock</div>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ReactRouter.Link with parameters', () => {
    // when
    renderWithRouter(<LayoutHeaderLogosComponent logo={LogoMock} title="any-title-mock" />);
    // then
    expect(Link).toHaveBeenCalledTimes(1);
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'LayoutHeaderComponent-logos flex-columns flex-start items-center',
        title: 'any-title-mock',
        to: '/',
      }),
      {},
    );
  });

  it('should call the logo passed throught params', () => {
    // when
    renderWithRouter(<LayoutHeaderLogosComponent logo={LogoMock} title="any-title-mock" />);
    // then
    expect(LogoMock).toHaveBeenCalledTimes(1);
  });

  it('should call the marianne logo', () => {
    // when
    renderWithRouter(<LayoutHeaderLogosComponent logo={LogoMock} title="any-title-mock" />);
    // then
    expect(LogoMarianneComponent).toHaveBeenCalledTimes(1);
    expect(LogoMarianneComponent).toHaveBeenCalledWith({ className: 'mr40' }, {});
  });
});
