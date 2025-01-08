import { render } from '@testing-library/react';
import { RiAccountCircleFill as UserIcon } from 'react-icons/ri';

import { Sizes } from '../../enums';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  it('should match the snapshot with default value', () => {
    // When
    const { container } = render(<BadgeComponent label="label" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot with default value and custom icon', () => {
    // When
    const { container } = render(<BadgeComponent Icon={UserIcon} label="label" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should have class fr-badge--custom-color if colorName is "custom-color"', () => {
    // When
    const { getByTestId } = render(
      <BadgeComponent colorName="custom-color" dataTestId="BadgeComponent" label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // Then
    expect(element).toHaveClass('fr-badge--custom-color');
  });

  it('should have class fr-badge--sm if size is "sm"', () => {
    // When
    const { getByTestId } = render(
      <BadgeComponent dataTestId="BadgeComponent" label="label" size={Sizes.SMALL} />,
    );
    const element = getByTestId('BadgeComponent');

    // Then
    expect(element).toHaveClass('fr-badge--sm');
  });

  it('should have class fr-badge--no-icon if noIcon is set to true', () => {
    // When
    const { getByTestId } = render(
      <BadgeComponent noIcon dataTestId="BadgeComponent" label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // Then
    expect(element).toHaveClass('fr-badge--no-icon');
  });

  it('should have class fr-badge--no-icon if we define a custom icon', () => {
    // When
    const { getByTestId } = render(
      <BadgeComponent dataTestId="BadgeComponent" Icon={UserIcon} label="label" />,
    );
    const element = getByTestId('BadgeComponent');

    // Then
    expect(element).toHaveClass('fr-badge--no-icon');
  });

  it('should have element <Icon /> if we define a custom icon and noIcon value set to false', () => {
    // Given
    jest.mocked(UserIcon);

    // When
    render(<BadgeComponent Icon={UserIcon} label="label" />);

    // Then
    expect(UserIcon).toHaveBeenCalledOnce();
  });

  it('should not have element <Icon /> even if we define a custom icon with noIcon value at true', () => {
    // Given
    jest.mocked(UserIcon);

    // When
    render(<BadgeComponent noIcon Icon={UserIcon} label="label" />);

    // Then
    expect(UserIcon).toHaveBeenCalledTimes(0);
  });
});
