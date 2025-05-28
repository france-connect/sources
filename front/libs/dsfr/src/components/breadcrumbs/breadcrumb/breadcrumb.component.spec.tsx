import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { BreadCrumbComponent } from './breadcrumb.component';

describe('BreadCrumbComponent', () => {
  it('should match snapshot when is not current page', () => {
    // When
    const { container } = render(
      <BreadCrumbComponent href="any-href-mock" label="any-label-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className: 'fr-breadcrumb__link',
        to: 'any-href-mock',
      },
      undefined,
    );
  });

  it('should match snapshot when is current page', () => {
    // When
    const { container } = render(
      <BreadCrumbComponent isCurrent href="any-href-mock" label="any-label-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'aria-current': 'page',
        children: 'any-label-mock',
        className: 'fr-breadcrumb__link',
        to: 'any-href-mock',
      },
      undefined,
    );
  });

  it('should match snapshot when title is defined', () => {
    // When
    const { container } = render(
      <BreadCrumbComponent href="any-href-mock" label="any-label-mock" title="any-title-mock" />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'any-label-mock',
        className: 'fr-breadcrumb__link',
        title: 'any-title-mock',
        to: 'any-href-mock',
      },
      undefined,
    );
  });
});
