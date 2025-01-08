import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';

import { IconPlacement, Priorities, Sizes } from '../../../enums';
import { LinkButton } from './link.button';

describe('SimpleLink', () => {
  it('should match the snapshot, with default values', () => {
    // When
    const { container, getByText } = render(
      <LinkButton link="any-link-mock">any-label-mock</LinkButton>,
    );
    const element = getByText('any-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className: 'fr-btn fr-btn--md',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-testid': undefined,
        title: undefined,
        to: 'any-link-mock',
      },
      {},
    );
  });

  it('should match the snapshot, with optionnal values', () => {
    // When
    const { container, getByText } = render(
      <LinkButton
        noOutline
        className="any-className-mock"
        dataTestId="any-dataTestId-mock"
        icon="any-icon-mock"
        iconPlacement={IconPlacement.LEFT}
        link="any-link-mock"
        priority={Priorities.TERTIARY}
        size={Sizes.LARGE}
        title="any-title-mock">
        any-label-mock
      </LinkButton>,
    );
    const element = getByText('any-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(element).toBeInTheDocument();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className:
          'fr-btn fr-btn--lg fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-any-icon-mock any-className-mock',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-testid': 'any-dataTestId-mock',
        title: 'any-title-mock',
        to: 'any-link-mock',
      },
      {},
    );
  });
});
