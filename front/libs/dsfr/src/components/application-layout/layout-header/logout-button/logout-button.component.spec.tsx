import { render } from '@testing-library/react';
import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { LogoutButtonComponent } from './logout-button.component';

describe('LogoutButtonComponent', () => {
  // given
  const endSessionUrl = 'any-endsessionurl-mock';
  const useContextSpy = jest.spyOn(React, 'useContext').mockImplementation(() => ({
    state: { config: { OidcClient: { endpoints: { endSessionUrl } } } },
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call useApiGet with endSessionUrl', () => {
    // when
    render(<LogoutButtonComponent />);
    // then
    expect(useContextSpy).toHaveBeenCalledTimes(1);
  });

  it('should render the logout link with an accessible title', () => {
    // when
    const { getByTitle } = render(<LogoutButtonComponent />);
    const element = getByTitle(/bouton permettant la déconnexion de votre compte/i);
    // then
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('A');
    expect(element).toHaveAttribute('href', 'any-endsessionurl-mock');
  });

  it('should render the logout link text content', () => {
    // when
    const { getByText } = render(<LogoutButtonComponent />);
    const element = getByText(/Se déconnecter/i);
    // then
    expect(element).toBeInTheDocument();
  });

  it('should call the icon with classname', () => {
    // when
    render(<LogoutButtonComponent />);
    // then
    expect(RiCloseLine).toHaveBeenCalledTimes(1);
    expect(RiCloseLine).toHaveBeenCalledWith({ className: 'mr8' }, {});
  });

  it('should render with the classes for the expected behavior', () => {
    // when
    const { container } = render(<LogoutButtonComponent />);
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('flex-columns');
    expect(element).toHaveClass('items-center');
    expect(element).toHaveClass('no-flex-grow');
    expect(element).toHaveClass('no-white-space');
  });

  it('should render with the custom class from props', () => {
    // when
    const { container } = render(<LogoutButtonComponent className="any-classname-mock" />);
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('any-classname-mock');
  });

  it('should call useMediaQuery with query param', () => {
    // when
    render(<LogoutButtonComponent />);
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should render for a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(<LogoutButtonComponent />);
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('flex-end');
  });

  it('should render for a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<LogoutButtonComponent />);
    const element = container.firstChild;
    // then
    expect(element).not.toHaveClass('flex-end');
  });
});
