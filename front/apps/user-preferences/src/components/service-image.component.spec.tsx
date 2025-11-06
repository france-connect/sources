import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

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

  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-labels-idp-mock');
  });

  it('should call t 1 time with correct params', () => {
    // When
    render(<ServiceImageComponent service={serviceMock} />);

    // Then
    expect(t).toHaveBeenCalledExactlyOnceWith('UserPreferences.labels.idp');
  });

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
    const element = getByAltText(`any-labels-idp-mock title-mock`);

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
