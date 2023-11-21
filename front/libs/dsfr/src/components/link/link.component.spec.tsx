import { render } from '@testing-library/react';

import { Sizes } from '../../enums';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  it('should match the snapshot, with default props', () => {
    // when
    const { container } = render(<LinkComponent href="any-url-mock" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with size sm props', () => {
    // when
    const { container } = render(<LinkComponent href="any-url-mock" size={Sizes.SMALL} />);

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-link fr-link--sm');
  });

  it('should match the snapshot, with size lg props', () => {
    // when
    const { container } = render(<LinkComponent href="any-url-mock" size={Sizes.LARGE} />);

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-link fr-link--lg');
  });

  it('should match the snapshot, with icon props', () => {
    // when
    const { container } = render(<LinkComponent href="any-url-mock" icon="any-icon-mock" />);

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-icon-any-icon-mock');
  });

  it('should match the snapshot, with iconPlacement props', () => {
    // when
    const { container } = render(
      <LinkComponent href="any-url-mock" icon="any-icon-mock" iconPlacement="right" />,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-link--icon-right');
  });

  it('should match the snapshot, with label props', () => {
    // when
    const { container, getByText } = render(
      <LinkComponent href="any-url-mock" label="any-label-mock" />,
    );
    const element = getByText('any-label-mock');

    // then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
  });

  it('should match the snapshot, with className props', () => {
    // when
    const { container } = render(
      <LinkComponent className="any-className-mock" href="any-url-mock" />,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('any-className-mock');
  });
});
