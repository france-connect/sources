import { render } from '@testing-library/react';

import { HeadingTag } from '@fc/common';
import { Sizes } from '@fc/dsfr';

import { CalloutComponent } from './callout.component';

describe('CalloutComponent', () => {
  // Given
  const childrenContent = 'Children';
  const title = 'title';

  it('should match the snapshot', () => {
    // When
    const { container } = render(
      <CalloutComponent title={title}>{childrenContent}</CalloutComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should display the children content', () => {
    // When
    const { getByText } = render(
      <CalloutComponent title={title}>{childrenContent}</CalloutComponent>,
    );

    // Then
    expect(getByText(childrenContent)).toBeInTheDocument();
  });

  it('should have class fr-callout--sm if size is "sm"', () => {
    // When
    const { getByTestId } = render(
      <CalloutComponent dataTestId="CalloutComponent" size={Sizes.SMALL} title={title}>
        {childrenContent}
      </CalloutComponent>,
    );
    const element = getByTestId('CalloutComponent');

    // Then
    expect(element).toHaveClass('fr-callout--sm');
  });

  it('should render the correct heading element', () => {
    // Given
    const heading = HeadingTag.H2;

    // When
    const { getByRole } = render(
      <CalloutComponent heading={heading} title={title}>
        Children
      </CalloutComponent>,
    );
    const headingElement = getByRole('heading', { level: 2 });

    // Then
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent(title);
  });
});
