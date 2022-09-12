import { fireEvent, render } from '@testing-library/react';

import { IconPlacement, Priorities, Sizes } from '../../enums';
import { SimpleButton } from './simple.button';

describe('SimpleButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match the snapshot', () => {
    // when
    const { container } = render(<SimpleButton label="any-label-mock" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is defined to Sizes.LARGE', () => {
    // when
    const { container } = render(<SimpleButton label="any-label-mock" size={Sizes.LARGE} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is defined to Sizes.MEDIUM', () => {
    // when
    const { container } = render(<SimpleButton label="any-label-mock" size={Sizes.MEDIUM} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is defined to Sizes.SMALL', () => {
    // when
    const { container } = render(<SimpleButton label="any-label-mock" size={Sizes.SMALL} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should render the firstchild as a button', () => {
    // when
    const { container, getByRole } = render(<SimpleButton label="any-label-mock" />);
    const element = getByRole('button');

    // then
    expect(element).toStrictEqual(container.firstChild);
  });

  it('should render the label', () => {
    // when
    const { getByText } = render(<SimpleButton label="any-label-mock" />);
    const linkElement = getByText('any-label-mock');

    // then
    expect(linkElement).toBeInTheDocument();
  });

  it('should have the disable attribute', () => {
    // when
    const { getByRole } = render(<SimpleButton disabled label="any-label-mock" />);
    const element = getByRole('button');

    // then
    expect(element).toHaveAttribute('disabled');
  });

  it('should have the title attribute', () => {
    // when
    const { getByRole } = render(<SimpleButton label="any-label-mock" title="any-title-mock" />);
    const element = getByRole('button');

    // then
    expect(element).toHaveAttribute('title', 'any-title-mock');
  });

  it('should have the type attribute defined', () => {
    // when
    const { getByRole } = render(<SimpleButton label="any-label-mock" type="reset" />);
    const element = getByRole('button');

    // then
    expect(element).toHaveAttribute('type', 'reset');
  });

  it('should call the callback mock when user click the button', () => {
    // given
    const onClickMock = jest.fn();
    // when
    const { getByRole } = render(<SimpleButton label="any-label-mock" onClick={onClickMock} />);
    const element = getByRole('button');
    fireEvent.click(element);

    // then
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should have the classname when priority is equal to Priorities.SECONDARY', () => {
    // when
    const { getByRole } = render(
      <SimpleButton label="any-label-mock" priority={Priorities.SECONDARY} />,
    );
    const element = getByRole('button');

    // then
    expect(element).toHaveClass('fr-btn--secondary');
  });

  it('should have the classname when priority is equal to Priorities.TERTIARY', () => {
    // when
    const { getByRole } = render(
      <SimpleButton label="any-label-mock" priority={Priorities.TERTIARY} />,
    );
    const element = getByRole('button');

    // then
    expect(element).toHaveClass('fr-btn--tertiary');
  });

  it('should have the classname when priority is equal to Priorities.TERTIARY and noOutline is defined', () => {
    // when
    const { getByRole } = render(
      <SimpleButton noOutline label="any-label-mock" priority={Priorities.TERTIARY} />,
    );
    const element = getByRole('button');

    // then
    expect(element).toHaveClass('fr-btn--tertiary-no-outline');
  });

  it('should have the classname when icon is defined', () => {
    // when
    const { getByRole } = render(<SimpleButton icon="any-icon-mock" label="any-label-mock" />);
    const element = getByRole('button');

    // then
    expect(element).toHaveClass('fr-fi-any-icon-mock');
    expect(element).toHaveClass('fr-btn--icon-right');
  });

  it('should have the classname when icon placement is defined', () => {
    // when
    const { getByRole } = render(
      <SimpleButton
        icon="any-icon-mock"
        iconPlacement={IconPlacement.LEFT}
        label="any-label-mock"
      />,
    );
    const element = getByRole('button');

    // then
    expect(element).toHaveClass('fr-fi-any-icon-mock');
    expect(element).toHaveClass('fr-btn--icon-left');
  });
});
