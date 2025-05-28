import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { IconPlacement } from '../../enums';
import { LinkComponent } from './link.component';

describe('LinkComponent', () => {
  it('should match the snapshot, with default props', () => {
    // When
    const { container } = render(<LinkComponent href="any-url-mock">any-label-mock</LinkComponent>);

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className: 'fr-link fr-link--md',
        reloadDocument: false,
        to: 'any-url-mock',
      },
      undefined,
    );
  });

  it('should match the snapshot, with all props', () => {
    // When
    const { container } = render(
      <LinkComponent
        external
        dataTestId="data-test-id"
        href="any-url-mock"
        icon="any-icon-mock"
        iconPlacement={IconPlacement.RIGHT}
        rel="noopener"
        target="_blank"
        title="any-title-mock">
        any-label-mock
      </LinkComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className: 'fr-link fr-link--md fr-icon-any-icon-mock fr-link--icon-right',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-testid': 'data-test-id',
        rel: 'noopener',
        reloadDocument: true,
        target: '_blank',
        title: 'any-title-mock',
        to: 'any-url-mock',
      },
      undefined,
    );
  });

  it('should match the snapshot, when external is defined but no rel or target are defined', () => {
    // When
    const { container } = render(
      <LinkComponent external href="any-url-mock">
        any-label-mock
      </LinkComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      expect.objectContaining({
        rel: 'noopener noreferrer external',
        target: '_blank',
      }),
      undefined,
    );
  });
});
