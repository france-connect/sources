import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';

import { FormHeaderComponent } from './form-header.component';

describe('FormHeaderComponent', () => {
  it('should match the snapshot when title is defined', () => {
    // When
    const { container, getByText } = render(<FormHeaderComponent title="any-title-mock" />);
    const titleElt = getByText('any-title-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
  });

  it('should match the snapshot when description is defined', () => {
    // When
    const { container, getByText } = render(
      <FormHeaderComponent description="any-description-mock" />,
    );
    const descriptionElt = getByText('any-description-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(descriptionElt).toBeInTheDocument();
  });

  it('should match the snapshot when title and titleHeading are defined', () => {
    // When
    const { container, getByText } = render(
      <FormHeaderComponent title="any-title-mock" titleHeading={HeadingTag.H6} />,
    );
    const titleElt = getByText('any-title-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(titleElt.tagName).toBe('H6');
  });

  it('should match the snapshot when description and title are both defined', () => {
    // When
    const { container, getByText } = render(
      <FormHeaderComponent description="any-description-mock" title="any-title-mock" />,
    );
    const titleElt = getByText('any-title-mock');
    const descriptionElt = getByText('any-description-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(titleElt).toBeInTheDocument();
    expect(descriptionElt).toBeInTheDocument();
  });
});
