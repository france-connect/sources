import { render } from '@testing-library/react';

import { CardDetailComponent } from './card.detail';

describe('CardDetailComponent', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<CardDetailComponent content="This is the card detail content" />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the content', () => {
    // Given
    const { getByText } = render(<CardDetailComponent content="This is the card detail content" />);
    const element = getByText('This is the card detail content');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render the classname', () => {
    // When
    const { container } = render(
      <CardDetailComponent className="custom-class" content="This is the card detail content" />,
    );

    // Then
    expect(container.firstChild).toHaveClass('fr-card__detail');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render the data-testid', () => {
    // When
    const { container } = render(
      <CardDetailComponent
        className="custom-class"
        content="This is the card detail content"
        dataTestId="any-data-testid-mock"
      />,
    );

    // Then
    expect(container.firstChild).toHaveAttribute('data-testid', 'any-data-testid-mock');
  });
});
