import { fireEvent, render } from '@testing-library/react';

import { ButtonTypes, IconPlacement, Priorities, Sizes } from '../../../enums';
import { SimpleButton } from './simple.button';

describe('SimpleButton', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = render(<SimpleButton>any-label-mock</SimpleButton>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when label is hidden', () => {
    // When
    const { container } = render(
      <SimpleButton hideLabel icon="any-icon-mock" iconPlacement={'left' as IconPlacement} />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container).not.toHaveClass('fr-btn--icon-left');
  });

  it('should match the snapshot, when size is defined to Sizes.LARGE', () => {
    // When
    const { container } = render(<SimpleButton size={Sizes.LARGE}>any-label-mock</SimpleButton>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is defined to Sizes.MEDIUM', () => {
    // When
    const { container } = render(<SimpleButton size={Sizes.MEDIUM}>any-label-mock</SimpleButton>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is defined to Sizes.SMALL', () => {
    // When
    const { container } = render(<SimpleButton size={Sizes.SMALL}>any-label-mock</SimpleButton>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render the firstchild as a button', () => {
    // When
    const { container, getByRole } = render(<SimpleButton>any-label-mock</SimpleButton>);
    const element = getByRole('button');

    // Then
    expect(element).toStrictEqual(container.firstChild);
  });

  it('should render the label', () => {
    // When
    const { getByText } = render(<SimpleButton>any-label-mock</SimpleButton>);
    const linkElement = getByText('any-label-mock');

    // Then
    expect(linkElement).toBeInTheDocument();
  });

  it('should have the disable attribute', () => {
    // When
    const { getByRole } = render(<SimpleButton disabled>any-label-mock</SimpleButton>);
    const element = getByRole('button');

    // Then
    expect(element).toHaveAttribute('disabled');
  });

  it('should have the title attribute', () => {
    // When
    const { getByRole } = render(
      <SimpleButton title="any-title-mock">any-label-mock</SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveAttribute('title', 'any-title-mock');
  });

  it('should have the type attribute defined', () => {
    // When
    const { getByRole } = render(
      <SimpleButton type={ButtonTypes.RESET}>any-label-mock</SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveAttribute('type', 'reset');
  });

  it('should call the callback mock when user click the button', () => {
    // Given
    const onClickMock = jest.fn();
    // When
    const { getByRole } = render(<SimpleButton onClick={onClickMock}>any-label-mock</SimpleButton>);
    const element = getByRole('button');
    fireEvent.click(element);

    // Then
    expect(onClickMock).toHaveBeenCalledOnce();
  });

  it('should have the classname when priority is equal to Priorities.SECONDARY', () => {
    // When
    const { getByRole } = render(
      <SimpleButton priority={Priorities.SECONDARY}>any-label-mock</SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('fr-btn--secondary');
  });

  it('should have the classname when priority is equal to Priorities.TERTIARY', () => {
    // When
    const { getByRole } = render(
      <SimpleButton priority={Priorities.TERTIARY}>any-label-mock</SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('fr-btn--tertiary');
  });

  it('should have the classname when priority is equal to Priorities.TERTIARY and noOutline is defined', () => {
    // When
    const { getByRole } = render(
      <SimpleButton noOutline priority={Priorities.TERTIARY}>
        any-label-mock
      </SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('fr-btn--tertiary-no-outline');
  });

  it('should have the classname when icon is defined', () => {
    // When
    const { getByRole } = render(<SimpleButton icon="any-icon-mock">any-label-mock</SimpleButton>);
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('fr-icon-any-icon-mock');
    expect(element).toHaveClass('fr-btn--icon-right');
  });

  it('should have the classname when icon placement is defined', () => {
    // When
    const { getByRole } = render(
      <SimpleButton icon="any-icon-mock" iconPlacement={IconPlacement.LEFT}>
        any-label-mock
      </SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('fr-icon-any-icon-mock');
    expect(element).toHaveClass('fr-btn--icon-left');
  });

  it('should have a custom classname when props is defined', () => {
    // When
    const { getByRole } = render(
      <SimpleButton
        className="any-classname-mock"
        icon="any-icon-mock"
        iconPlacement={IconPlacement.LEFT}>
        any-label-mock
      </SimpleButton>,
    );
    const element = getByRole('button');

    // Then
    expect(element).toHaveClass('any-classname-mock');
  });

  it('should have a custom data-testid when props is defined', () => {
    // When
    const { getByTestId } = render(
      <SimpleButton
        className="any-classname-mock"
        dataTestId="any-datatestid-mock"
        icon="any-icon-mock"
        iconPlacement={IconPlacement.LEFT}>
        any-label-mock
      </SimpleButton>,
    );
    const element = getByTestId('any-datatestid-mock');

    // Then
    expect(element).toBeInTheDocument();
  });
});
