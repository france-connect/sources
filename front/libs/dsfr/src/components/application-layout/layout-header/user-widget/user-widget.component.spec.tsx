import { render } from '@testing-library/react';
import { RiUser3Fill as UserIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { userInfosMock } from '../__fixtures__';
import { UserWidgetComponent } from './user-widget.component';

describe('UserWidgetComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the family name and the given name', () => {
    // when
    const { getByText } = render(<UserWidgetComponent userInfos={userInfosMock} />);
    const givenNameElement = getByText(/any-given-name-mock/);
    const familyNameElement = getByText(/any-family-name-mock/);
    // then
    expect(givenNameElement).toBeInTheDocument();
    expect(familyNameElement).toBeInTheDocument();
  });

  it('should have the class defined for the expected behavior', () => {
    // when
    const { container } = render(<UserWidgetComponent userInfos={userInfosMock} />);
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('flex-columns');
    expect(element).toHaveClass('items-center');
    expect(element).toHaveClass('is-blue-france');
    expect(element).toHaveClass('no-flex-grow');
    expect(element).toHaveClass('no-white-space');
  });

  it('should render the user icon', () => {
    // when
    render(<UserWidgetComponent userInfos={userInfosMock} />);
    // then
    expect(UserIcon).toHaveBeenCalledTimes(1);
    expect(UserIcon).toHaveBeenCalledWith({ className: 'mr8' }, {});
  });

  it('should have the className passed throught props', () => {
    // when
    const { container } = render(
      <UserWidgetComponent className="any-classname" userInfos={userInfosMock} />,
    );
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('any-classname');
  });

  it('should call useMediaQuery with query param', () => {
    // when
    render(<UserWidgetComponent userInfos={userInfosMock} />);
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should render for a desktop viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(<UserWidgetComponent userInfos={userInfosMock} />);
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('flex-end');
  });

  it('should render for a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<UserWidgetComponent userInfos={userInfosMock} />);
    const element = container.firstChild;
    // then
    expect(element).not.toHaveClass('flex-end');
  });
});
