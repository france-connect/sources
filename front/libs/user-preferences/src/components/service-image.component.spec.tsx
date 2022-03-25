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

  it('should show a placeholder instead of an image', () => {
    // when
    const { container, getByText } = render(<ServiceImageComponent service={serviceMock} />);
    const wrapper = container.firstChild;
    const element = getByText('title-mock');
    // then
    expect(wrapper).toHaveClass('ServiceComponent-image');
    expect(wrapper).toHaveClass('is-table');
    expect(element.tagName).toStrictEqual('B');
    expect(element).toHaveClass('is-table-cell');
    expect(element).toHaveClass('v-align-middle');
    expect(element).toHaveClass('text-center');
  });

  it('should show an image', () => {
    // given
    const servicesMockWithImage = { ...serviceMock, image: 'image.mock' };
    // when
    const { container, getByAltText } = render(
      <ServiceImageComponent service={servicesMockWithImage} />,
    );
    const wrapper = container.firstChild;
    const element = getByAltText(`fournisseur d'identité title-mock`);
    // then
    expect(wrapper).not.toHaveClass('is-table');
    expect(element.tagName).toStrictEqual('IMG');
    expect(element).toHaveAttribute('src', '/images/image.mock');
    expect(element).toHaveAttribute('height', 'auto');
    expect(element).toHaveAttribute('width', 'auto');
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
    expect(wrapper).toHaveClass('ServiceComponent-image');
    expect(wrapper).toHaveClass('disabled');
    expect(wrapper).toHaveClass('opacity-45');
  });
});
