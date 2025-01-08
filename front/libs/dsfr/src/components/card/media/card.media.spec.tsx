import { render } from '@testing-library/react';

import { CardMediaComponent } from './card.media';

describe('CardMediaComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<CardMediaComponent alt="Image alt mock" src="test-image.jpg" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render an image with the defined alt and src', () => {
    // When
    const { getByAltText } = render(
      <CardMediaComponent alt="Image alt mock" src="test-image.jpg" />,
    );
    const imageElement = getByAltText('Image alt mock');

    // Then
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'test-image.jpg');
  });

  it('should render an image with empty alt if alt is not defined', () => {
    // When
    const { getByAltText } = render(<CardMediaComponent src="test-image.jpg" />);
    const imageElement = getByAltText('');

    // Then
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'test-image.jpg');
  });
});
