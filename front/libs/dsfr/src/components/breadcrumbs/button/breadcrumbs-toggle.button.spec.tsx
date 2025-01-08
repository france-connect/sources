import { fireEvent, render } from '@testing-library/react';
import { useToggle } from 'usehooks-ts';

import { t } from '@fc/i18n';

import { BreadCrumbsToggleButton } from './breadcrumbs-toggle.button';

describe('BreadCrumbsToggleButton', () => {
  // Given
  const uniqid = 'any-uniqid-mock';
  const toggleShowMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('DSFR.breadcrumbs.show');
    jest
      .mocked(useToggle)
      .mockReturnValue([
        'any-toggle-value-mock' as unknown as boolean,
        toggleShowMock,
        expect.any(Function),
      ]);
  });

  it('should match snapshot', () => {
    // When
    const { container, getByText } = render(<BreadCrumbsToggleButton id={uniqid} />);
    const button = getByText('DSFR.breadcrumbs.show');

    // Then
    expect(button).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    expect(button).toHaveAttribute('aria-controls', 'any-uniqid-mock');
    expect(button).toHaveAttribute('aria-expanded', 'any-toggle-value-mock');
    expect(button).toHaveAttribute('class', 'fr-breadcrumb__button');
    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith('DSFR.breadcrumbs.show');
  });

  it('should update the button visibility value on click', () => {
    // When
    const { getByText } = render(<BreadCrumbsToggleButton id={uniqid} />);
    const button = getByText('DSFR.breadcrumbs.show');
    fireEvent.click(button);

    // Then
    expect(toggleShowMock).toHaveBeenCalledOnce();
  });
});
