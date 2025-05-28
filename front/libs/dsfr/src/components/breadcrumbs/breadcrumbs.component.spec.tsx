import { render } from '@testing-library/react';
import React from 'react';

import { t } from '@fc/i18n';

import { BreadCrumbComponent } from './breadcrumb';
import { BreadCrumbsComponent } from './breadcrumbs.component';
import { BreadCrumbsToggleButton } from './button';

jest.mock('./breadcrumb/breadcrumb.component');
jest.mock('./button/breadcrumbs-toggle.button');

describe('breadCrumbsComponent', () => {
  // Given
  const useIdMock = jest.spyOn(React, 'useId');

  beforeEach(() => {
    // Given
    jest.mocked(useIdMock).mockReturnValue('usedid-mock-value');
    jest.mocked(t).mockReturnValue('DSFR.breadcrumbs.location');
  });

  it('should match snapshot', () => {
    // Given
    const items = [
      { href: 'any-href-mock-1', label: 'any-label-mock-1', title: 'any-title-mock-1' },
      { href: 'any-href-mock-2', label: 'any-label-mock-2' },
    ];

    // When
    const { container, getByTestId } = render(<BreadCrumbsComponent items={items} />);
    const crumbsContainer = getByTestId('breadcrumbs::usedid-mock-value');

    // Then
    expect(useIdMock).toHaveBeenCalledOnce();
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveAttribute('class', 'fr-breadcrumb');
    expect(container.firstChild).toHaveAttribute('role', 'navigation');
    expect(container.firstChild).toHaveAttribute('aria-label', 'DSFR.breadcrumbs.location');
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.breadcrumbs.location');
    expect(BreadCrumbsToggleButton).toHaveBeenCalledOnce();
    expect(BreadCrumbsToggleButton).toHaveBeenCalledWith(
      {
        id: 'breadcrumbs::usedid-mock-value',
      },
      undefined,
    );
    expect(crumbsContainer).toBeInTheDocument();
    expect(crumbsContainer).toHaveAttribute('id', 'breadcrumbs::usedid-mock-value');
    expect(crumbsContainer).toHaveAttribute('class', 'fr-collapse');
    expect(BreadCrumbComponent).toHaveBeenCalledTimes(2);
    expect(BreadCrumbComponent).toHaveBeenNthCalledWith(
      1,
      {
        href: 'any-href-mock-1',
        isCurrent: false,
        label: 'any-label-mock-1',
        title: 'any-title-mock-1',
      },
      undefined,
    );
    expect(BreadCrumbComponent).toHaveBeenNthCalledWith(
      2,
      {
        href: 'any-href-mock-2',
        isCurrent: true,
        label: 'any-label-mock-2',
      },
      undefined,
    );
  });
});
