import { render } from '@testing-library/react';

import { t } from '@fc/i18n';

import { IconPlacement, Sizes } from '../../enums';
import { LinkEmailComponent } from './link-email.component';

describe('LinkEmailComponent', () => {
  beforeEach(() => {
    // Given
    jest.mocked(t).mockReturnValue('any-acme-sendto-email');
  });

  it('should match the snapshot, with default props', () => {
    // When
    const { container, getByRole, getByText } = render(
      <LinkEmailComponent email="any-email-mock" />,
    );
    const linkElt = getByRole('link');
    const emailElt = getByText('any-email-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(emailElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledExactlyOnceWith('DSFR.link.sendEmailTo', { email: 'any-email-mock' });
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('href', 'mailto:any-email-mock');
    expect(linkElt).toHaveAttribute('aria-label', 'any-acme-sendto-email');
    expect(linkElt).toHaveClass('fr-link fr-link--md');
  });

  it('should match the snapshot, with all props', () => {
    // When
    const { container, getByRole, getByText } = render(
      <LinkEmailComponent
        className="any-classname-mock"
        dataTestId="data-test-id"
        email="any-email-mock"
        icon="any-icon-mock"
        iconPlacement={IconPlacement.RIGHT}
        size={Sizes.SMALL}
        title="any-title-mock">
        any-email-children-mock
      </LinkEmailComponent>,
    );
    const linkElt = getByRole('link');
    const childrenElt = getByText('any-email-children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(childrenElt).toBeInTheDocument();
    expect(t).toHaveBeenCalledExactlyOnceWith('DSFR.link.sendEmailTo', { email: 'any-email-mock' });
    expect(linkElt).toBeInTheDocument();
    expect(linkElt).toHaveAttribute('href', 'mailto:any-email-mock');
    expect(linkElt).toHaveAttribute('aria-label', 'any-acme-sendto-email');
    expect(linkElt).toHaveAttribute('data-testid', 'data-test-id');
    expect(linkElt).toHaveClass(
      'fr-link fr-link--sm fr-icon-any-icon-mock fr-link--icon-right any-classname-mock',
    );
  });

  it('should match the snapshot, with the label props', () => {
    const { container, getByText } = render(
      <LinkEmailComponent email="any-email-mock" label="any-email-label-mock" />,
    );
    const labelElt = getByText('any-email-label-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(labelElt).toBeInTheDocument();
  });
});
