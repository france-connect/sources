import { render } from '@testing-library/react';

import { BadgeComponent } from '../badge/badge.component';
import { BadgesGroupComponent } from './badges-group.component';

jest.mock('../badge/badge.component');

describe('BadgesGroupComponent', () => {
  // Given
  const badges = [
    { colorName: 'red', label: 'Red Badge' },
    { colorName: 'blue', label: 'Blue Badge' },
    { colorName: 'green', label: 'Green Badge' },
  ];

  it('should match the snapshot', () => {
    // When
    const { container } = render(<BadgesGroupComponent item={badges} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render a badge group with multiple badges', () => {
    // When
    render(<BadgesGroupComponent item={badges} />);

    // Then
    expect(BadgeComponent).toHaveBeenCalledTimes(3);
    expect(BadgeComponent).toHaveBeenNthCalledWith(
      1,
      {
        colorName: 'red',
        label: 'Red Badge',
      },
      {},
    );
    expect(BadgeComponent).toHaveBeenNthCalledWith(
      2,
      {
        colorName: 'blue',
        label: 'Blue Badge',
      },
      {},
    );
    expect(BadgeComponent).toHaveBeenNthCalledWith(
      3,
      {
        colorName: 'green',
        label: 'Green Badge',
      },
      {},
    );
  });
});
