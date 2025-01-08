import { render } from '@testing-library/react';

import { EventTypes } from '@fc/common';

import { Sizes } from '../../enums';
import { AlertComponent } from './alert.component';

describe('Alert', () => {
  it('should match the snapshot with default values', () => {
    // When
    const { container } = render(<AlertComponent>Children</AlertComponent>);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should remove the role="alert" attribute if noRole is true', () => {
    // When
    const { getByTestId } = render(<AlertComponent noRole>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).not.toHaveAttribute('role');
  });

  it('should have class fr-alert--md by default when size is not defined', () => {
    // When
    const { getByTestId } = render(<AlertComponent>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--md');
  });

  it('should have class fr-alert--info by default when type is not defined', () => {
    // When
    const { getByTestId } = render(<AlertComponent>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--info');
  });

  it('should have class fr-alert--sm if size is "sm"', () => {
    // When
    const { getByTestId } = render(<AlertComponent size={Sizes.SMALL}>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--sm');
  });

  it('should have class fr-alert--error if type is ERROR', () => {
    // When
    const { getByTestId } = render(
      <AlertComponent type={EventTypes.ERROR}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--error');
  });

  it('should have class fr-alert--info if type is INFO', () => {
    // When
    const { getByTestId } = render(
      <AlertComponent type={EventTypes.INFO}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--info');
  });

  it('should have class fr-alert--success if type is SUCCESS', () => {
    // When
    const { getByTestId } = render(
      <AlertComponent type={EventTypes.SUCCESS}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--success');
  });

  it('should have class fr-alert--warning if type is WARNING', () => {
    // When
    const { getByTestId } = render(
      <AlertComponent type={EventTypes.WARNING}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('fr-alert--warning');
  });

  it('should have class injected by className props', () => {
    // When
    const { getByTestId } = render(<AlertComponent className="foo bar">Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // Then
    expect(element).toHaveClass('foo bar');
  });

  it('should have a custom testid', () => {
    // When
    const { getByTestId } = render(
      <AlertComponent dataTestId="alert-component-custom-testid" type={EventTypes.WARNING}>
        Children
      </AlertComponent>,
    );
    const element = getByTestId('alert-component-custom-testid');

    // Then
    expect(element).toBeInTheDocument();
  });
});
