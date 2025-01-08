import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';

import { Sizes } from '../../enums';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
  it('should match the snapshot, with default values', () => {
    // When
    const { container } = render(
      <TileComponent link="any-link-mock" title="Tile title mock">
        any description text treat as children
      </TileComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with optionnal values', () => {
    // When
    const { container } = render(
      <TileComponent
        isHorizontal
        useDownload
        dataTestId="any-data-test-id-mock"
        description="any-description-mock"
        detail="any-detail-mock"
        Heading={HeadingTag.H1}
        link="any-link-mock"
        size={Sizes.LARGE}
        title="Tile title mock">
        any description text treat as children
      </TileComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });
});
