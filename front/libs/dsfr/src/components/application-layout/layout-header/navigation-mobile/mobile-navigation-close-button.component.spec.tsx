import { fireEvent, render } from '@testing-library/react';
import { RiCloseLine } from 'react-icons/ri';

import { MobileNavigationCloseButtonComponent } from './mobile-navigation-close-button.component';

describe('MobileNavigationCloseButtonComponent', () => {
  // given
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button', () => {
    // when
    const { getByRole } = render(<MobileNavigationCloseButtonComponent onClose={onCloseMock} />);
    const element = getByRole('button');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the classes for the expected behavior', () => {
    // when
    const { getByRole } = render(<MobileNavigationCloseButtonComponent onClose={onCloseMock} />);
    const element = getByRole('button');
    // then
    expect(element).toHaveClass('w100');
    expect(element).toHaveClass('flex-columns');
    expect(element).toHaveClass('flex-end');
    expect(element).toHaveClass('items-center');
    expect(element).toHaveClass('pr16');
    expect(element).toHaveClass('is-blue-france');
    expect(element).toHaveClass('fs14');
  });

  it('should render the button text', () => {
    // when
    const { getByText } = render(<MobileNavigationCloseButtonComponent onClose={onCloseMock} />);
    const element = getByText(/Fermer/);
    // then
    expect(element).toBeInTheDocument();
  });

  it('should call onClose callback when click the button', () => {
    // when
    const { getByRole } = render(<MobileNavigationCloseButtonComponent onClose={onCloseMock} />);
    const element = getByRole('button');
    fireEvent.click(element);
    // then
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call the icon with the classname', () => {
    // when
    render(<MobileNavigationCloseButtonComponent onClose={onCloseMock} />);
    // then
    expect(RiCloseLine).toHaveBeenCalledTimes(1);
    expect(RiCloseLine).toHaveBeenCalledWith({ className: 'ml12' }, {});
  });
});
