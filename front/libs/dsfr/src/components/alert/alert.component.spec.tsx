import { render } from '@testing-library/react';

import { EventTypes, HeadingTag } from '@fc/common';
import { t } from '@fc/i18n';

import { Sizes } from '../../enums';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  it('should match the snapshot with default values', () => {
    // Given
    jest.mocked(t).mockReturnValueOnce('DSFR.alert.close.mock_value');

    // When
    const { container, getByRole } = render(<AlertComponent />);

    // Then
    expect(() => getByRole('button')).toThrow();

    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-alert');
    expect(container.firstChild).toHaveClass('fr-alert--md');
    expect(container.firstChild).toHaveClass('fr-alert--info');
    expect(container.firstChild).toHaveRole('alert');
    expect(t).not.toHaveBeenCalledWith('DSFR.alert.close');
  });

  it('should match the snapshot with all optional values', () => {
    // Given
    const onCloseMock = jest.fn();
    jest.mocked(t).mockReturnValueOnce('DSFR.alert.close.mock_value');

    // When
    const { container, getByRole, getByText, getByTitle } = render(
      <AlertComponent
        noRole
        className="any-custom-class-mock"
        dataTestId="any-data-test-id-mock"
        heading={HeadingTag.H2}
        size={Sizes.MEDIUM}
        title="any-title-mock"
        type={EventTypes.ERROR}
        onClose={onCloseMock}>
        <p className="any-description-class-mock">any-description-value-mock</p>
      </AlertComponent>,
    );
    const titleElt = getByText('any-title-mock');
    const descriptionElt = getByText('any-description-value-mock');
    const buttonElement = getByTitle('DSFR.alert.close.mock_value');
    const buttonRoleElement = getByRole('button');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-alert');
    expect(container.firstChild).toHaveClass('fr-alert--md');
    expect(container.firstChild).toHaveClass('fr-alert--error');
    expect(container.firstChild).toHaveClass('any-custom-class-mock');
    expect(container.firstChild).toHaveAttribute('data-testid', 'any-data-test-id-mock');
    expect(container.firstChild).not.toHaveRole('alert');
    expect(titleElt).toBeInTheDocument();
    expect(titleElt.tagName).toBe('H2');
    expect(titleElt).toHaveAttribute('data-testid', 'any-data-test-id-mock-title');
    expect(descriptionElt).toBeInTheDocument();
    expect(descriptionElt).toHaveClass('any-description-class-mock');
    expect(t).toHaveBeenCalledWith('DSFR.alert.close');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('fr-link--close');
    expect(buttonElement).toHaveClass('fr-link');
    expect(buttonElement).toHaveTextContent('DSFR.alert.close.mock_value');
    expect(buttonElement).toBe(buttonRoleElement);
    expect(buttonElement).toHaveAttribute('data-testid', 'any-data-test-id-mock-close-button');
  });

  it('should match the snapshot, when size is small, title should not be displayed', () => {
    // When
    const { container, getByText } = render(
      <AlertComponent size={Sizes.SMALL} title="any-title-mock" />,
    );

    // Then
    expect(() => getByText('any-title-mock')).toThrow();

    expect(container.firstChild).toHaveClass('fr-alert--sm');
  });
});
