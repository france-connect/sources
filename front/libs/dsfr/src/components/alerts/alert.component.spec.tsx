import { render } from '@testing-library/react';

import { AlertTypes, Sizes } from '../../enums';
import { AlertComponent } from './alert.component';

describe('Alert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot with default values', () => {
    // when
    const { container } = render(<AlertComponent>Children</AlertComponent>);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should remove the role="alert" attribute if noRole is true', () => {
    // when
    const { getByTestId } = render(<AlertComponent noRole>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // then
    expect(element).not.toHaveAttribute('role');
  });

  it('should have class fr-alert--md by default when size is not defined', () => {
    // when
    const { getByTestId } = render(<AlertComponent>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--md');
  });

  it('should have class fr-alert--info by default when type is not defined', () => {
    // when
    const { getByTestId } = render(<AlertComponent>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--info');
  });

  it('should have class fr-alert--sm if size is "sm"', () => {
    // when
    const { getByTestId } = render(<AlertComponent size={Sizes.SMALL}>Children</AlertComponent>);
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--sm');
  });

  it('should have class fr-alert--error if type is ERROR', () => {
    // when
    const { getByTestId } = render(
      <AlertComponent type={AlertTypes.ERROR}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--error');
  });

  it('should have class fr-alert--info if type is INFO', () => {
    // when
    const { getByTestId } = render(
      <AlertComponent type={AlertTypes.INFO}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--info');
  });

  it('should have class fr-alert--success if type is SUCCESS', () => {
    // when
    const { getByTestId } = render(
      <AlertComponent type={AlertTypes.SUCCESS}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--success');
  });

  it('should have class fr-alert--warning if type is WARNING', () => {
    // when
    const { getByTestId } = render(
      <AlertComponent type={AlertTypes.WARNING}>Children</AlertComponent>,
    );
    const element = getByTestId('AlertComponent');

    // then
    expect(element).toHaveClass('fr-alert--warning');
  });

  it('should have class injected by className props', () => {
    // when
    const { getByTestId } = render(<AlertComponent className="foo bar">Children</AlertComponent>);
    const element = getByTestId('AlertComponent');
    // then
    expect(element).toHaveClass('foo bar');
  });

  it('should have a custom testid', () => {
    // when
    const { getByTestId } = render(
      <AlertComponent dataTestId="alert-component-custom-testid" type={AlertTypes.WARNING}>
        Children
      </AlertComponent>,
    );
    const element = getByTestId('alert-component-custom-testid');

    // then
    expect(element).toBeInTheDocument();
  });
});
