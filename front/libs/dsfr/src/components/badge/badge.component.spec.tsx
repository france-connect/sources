import { render } from '@testing-library/react';
import { RiAccountCircleFill as UserIcon } from 'react-icons/ri';

import { Sizes } from '../../enums';
import { BadgeComponent } from './badge.component';

jest.mock('react-icons/ri');

describe('BadgeComponent', () => {
  it('should match the snapshot with default value', () => {
    // when
    const { container } = render(<BadgeComponent label="label" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with default value and custom icon', () => {
    // when
    const { container } = render(<BadgeComponent icon={UserIcon} label="label" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should have class fr-badge--custom-color if colorName is "custom-color"', () => {
    // when
    const { getByTestId } = render(
      <BadgeComponent colorName="custom-color" dataTestId="BadgeComponent" label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // then
    expect(element).toHaveClass('fr-badge--custom-color');
  });

  it('should have class fr-badge--sm if size is "sm"', () => {
    // when
    const { getByTestId } = render(
      <BadgeComponent dataTestId="BadgeComponent" label="label" size={Sizes.SMALL} />,
    );
    const element = getByTestId('BadgeComponent');

    // then
    expect(element).toHaveClass('fr-badge--sm');
  });

  it('should have class fr-badge--no-icon if noIcon is set to true', () => {
    // when
    const { getByTestId } = render(
      <BadgeComponent noIcon dataTestId="BadgeComponent" label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // then
    expect(element).toHaveClass('fr-badge--no-icon');
  });

  it('should have class fr-badge--no-icon if we define a custom icon', () => {
    // when
    const { getByTestId } = render(
      <BadgeComponent dataTestId="BadgeComponent" icon={UserIcon} label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // then
    expect(element).toHaveClass('fr-badge--no-icon');
  });

  it('should have element <Icon /> if we define a custom icon and noIcon value set to false', () => {
    // given
    jest.mocked(UserIcon);

    // when
    render(<BadgeComponent icon={UserIcon} label="label" />);

    // then
    expect(UserIcon).toHaveBeenCalledTimes(1);
  });

  it('should not have element <Icon /> even if we define a custom icon with noIcon value at true', () => {
    // given
    jest.mocked(UserIcon);

    // when
    render(<BadgeComponent noIcon icon={UserIcon} label="label" />);

    // then
    expect(UserIcon).toHaveBeenCalledTimes(0);
  });
});
