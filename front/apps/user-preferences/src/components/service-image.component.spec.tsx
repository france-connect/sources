import { render } from '@testing-library/react';

import { ServiceImageComponent } from './service-image.component';

describe('ServiceImageComponent', () => {
  // Given
  const serviceMock = {
    active: true,
    image: undefined,
    isChecked: false,
    name: 'name-mock',
    title: 'title-mock',
    uid: 'uid-mock',
  };

  it('should match the snapshot', () => {
    // When
    const { container } = render(<ServiceImageComponent service={serviceMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should show a placeholder instead of an image', () => {
    // When
    const { container, getByText } = render(<ServiceImageComponent service={serviceMock} />);
    const element = getByText('title-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('B');
  });

  it('should show an image', () => {
    // Given
    const servicesMockWithImage = { ...serviceMock, image: 'image.mock' };

    // When
    const { container, getByAltText } = render(
      <ServiceImageComponent service={servicesMockWithImage} />,
    );
    const element = getByAltText(`fournisseur d'identité title-mock`);

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('IMG');
  });

  it('should be in a disabled state', () => {
    // Given
    const servicesMockWithImage = { ...serviceMock, image: 'image.mock' };

    // When
    const { container } = render(
      <ServiceImageComponent disabled service={servicesMockWithImage} />,
    );
    const wrapper = container.firstChild;

    // Then
    expect(container).toMatchSnapshot();
    expect(wrapper).toHaveClass('disabled');
    expect(wrapper).toHaveClass('opacity-45');
  });
});
