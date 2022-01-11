import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { renderWithRouter } from '@fc/tests-utils';

import { LogoMarianneComponent } from '../assets';
import { LayoutHeaderComponent } from './header.component';

jest.mock('react-responsive');
jest.mock('../assets/logo-marianne.component');

describe('LayoutHeaderComponent', () => {
  const useMediaQueryMock = mocked(useMediaQuery);
  const accessibleTitle = 'mock-accessible-title';
  const LogoComponent = jest.fn(() => <div data-testid="mock-logo-component" />);
  const ReturnButtonComponent = jest.fn(() => <div data-testid="mock-return-button" />);

  it('should render a link element', () => {
    // given
    const { getByTitle } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // when
    const element = getByTitle(accessibleTitle);
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName).toStrictEqual('A');
  });

  it('should have render the marianne logo', () => {
    // given
    renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(LogoMarianneComponent).toHaveBeenCalled();
  });

  it('should the logo passed in arguments', () => {
    // given
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(getByTestId('mock-logo-component')).toBeInTheDocument();
    expect(LogoComponent).toHaveBeenCalled();
  });

  it('should the button passed in arguments', () => {
    // given
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // then
    expect(getByTestId('mock-return-button')).toBeInTheDocument();
    expect(ReturnButtonComponent).toHaveBeenCalled();
  });

  it('should render the button inside the banner content for desktop', () => {
    // given
    const gtTablet = true; // so it's desktop
    useMediaQueryMock.mockReturnValue(gtTablet);
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // when
    const bannerContent = getByTestId('banner-content');
    const returnButton = getByTestId('mock-return-button');
    // then
    expect(returnButton).toBeInTheDocument();
    expect(useMediaQueryMock).toHaveBeenCalled();
    expect(ReturnButtonComponent).toHaveBeenCalled();
    expect(bannerContent).toContainElement(returnButton);
  });

  it('should render the button under the banner content for mobile', () => {
    // given
    const gtTablet = false; // so it's mobile
    useMediaQueryMock.mockReturnValue(gtTablet);
    const { getByTestId } = renderWithRouter(
      <LayoutHeaderComponent
        logo={LogoComponent}
        returnButton={ReturnButtonComponent}
        title={accessibleTitle}
      />,
    );
    // when
    const bannerContent = getByTestId('banner-content');
    const returnButton = getByTestId('mock-return-button');
    // then
    expect(returnButton).toBeInTheDocument();
    expect(useMediaQueryMock).toHaveBeenCalled();
    expect(ReturnButtonComponent).toHaveBeenCalled();
    expect(bannerContent).not.toContainElement(returnButton);
  });
});
