import { render } from '@testing-library/react';

import { ServiceImageComponent } from './service-image.component';

describe('ServiceImageComponent', () => {
  // given
  const serviceMock = {
    active: true,
    image: undefined,
    isChecked: false,
    name: 'name-mock',
    title: 'title-mock',
    uid: 'uid-mock',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<ServiceImageComponent service={serviceMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should show a placeholder instead of an image', () => {
    // when
    const { container, getByText } = render(<ServiceImageComponent service={serviceMock} />);
    const element = getByText('title-mock');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(element.tagName).toStrictEqual('B');
  });

  it('should show an image', () => {
    // given
    const servicesMockWithImage = { ...serviceMock, image: 'image.mock' };

    // when
    const { container, getByAltText } = render(
      <ServiceImageComponent service={servicesMockWithImage} />,
    );
    const element = getByAltText(`fournisseur d'identité title-mock`);

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(element.tagName).toStrictEqual('IMG');
  });

  it('should be in a disabled state', () => {
    // given
    const servicesMockWithImage = { ...serviceMock, image: 'image.mock' };

    // when
    const { container } = render(
      <ServiceImageComponent disabled service={servicesMockWithImage} />,
    );
    const wrapper = container.firstChild;

    // then
    expect(container).toMatchSnapshot();
    expect(wrapper).toHaveClass('disabled');
    expect(wrapper).toHaveClass('opacity-45');
  });
});
