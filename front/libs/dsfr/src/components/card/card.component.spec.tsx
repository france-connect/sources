import { render } from '@testing-library/react';
import { Link } from 'react-router';

import { HeadingTag } from '@fc/common';

import { CardBackgrounds, Sizes } from '../../enums';
import { BadgesGroupComponent } from '../badges-group';
import { CardComponent } from './card.component';
import { CardDetailComponent } from './detail';
import { CardMediaComponent } from './media';

jest.mock('./media/card.media');
jest.mock('./detail/card.detail');
jest.mock('../badges-group/badges-group.component');

describe('CardComponent', () => {
  it('should match the snapshot, with default values', () => {
    // When
    const { container } = render(
      <CardComponent title="Card title mock">any description text treat as children</CardComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, with all optionnal values', () => {
    // When
    const { container } = render(
      <CardComponent
        enlargeLink
        isHorizontal
        background={CardBackgrounds.SHADOW}
        badges={[{ label: 'any-badge' }]}
        className="any-classname-mock"
        details={{
          bottom: { className: 'any-classname-bottom-mock', content: 'any-content-bottom-mock' },
          top: { className: 'any-classname-top-mock', content: 'any-content-top-mock' },
        }}
        Heading={HeadingTag.H1}
        link="any-link-mock"
        media={{ alt: 'media-alt-mock', src: 'media-src-mock' }}
        size={Sizes.LARGE}
        title="Card title mock">
        any description text treat as children
      </CardComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  describe('className', () => {
    it('should render classnames on the main container when className is a string', () => {
      // When
      const { container } = render(
        <CardComponent
          enlargeLink
          isHorizontal
          background={CardBackgrounds.SHADOW}
          className="any-classname-mock"
          size={Sizes.LARGE}
          title="Card title mock">
          any description text treat as children
        </CardComponent>,
      );
      const element = container.firstChild;

      // Then
      expect(element).toHaveClass('fr-enlarge-link');
      expect(element).toHaveClass('fr-card--horizontal');
      expect(element).toHaveClass('fr-card--shadow');
      expect(element).toHaveClass('any-classname-mock');
      expect(element).toHaveClass('fr-card--lg');
    });

    it('should be an object with container, title and description properties', () => {
      // When
      const { container, getByTestId } = render(
        <CardComponent
          className={{
            container: 'any-classname-container-mock',
            description: 'any-classname-description-mock',
            title: 'any-classname-title-mock',
          }}
          title="Card title mock">
          any description text treat as children
        </CardComponent>,
      );
      const element = container.firstChild;
      const titleElt = getByTestId('CardComponent-title');
      const descriptionElt = getByTestId('CardComponent-description');

      // Then
      expect(element).toHaveClass('any-classname-container-mock');
      expect(titleElt).toHaveClass('any-classname-title-mock');
      expect(descriptionElt).toHaveClass('any-classname-description-mock');
    });
  });

  it('should render the heading tag with a link and the title', () => {
    // When
    const { getByRole } = render(
      <CardComponent Heading={HeadingTag.H1} link="any-link-mock" title="Card title mock">
        any description text treat as children
      </CardComponent>,
    );
    const titleElt = getByRole('heading', { level: 1 });

    // Then
    expect(titleElt).toBeInTheDocument();
    expect(titleElt).toHaveClass('fr-card__title');
    expect(titleElt).toHaveAttribute('data-testid', 'CardComponent-title');
    expect(Link).toHaveBeenCalledOnce();
    expect(Link).toHaveBeenCalledWith(
      {
        children: 'Card title mock',
        to: 'any-link-mock',
      },
      undefined,
    );
  });

  it('should render the description', () => {
    // When
    const { getByText } = render(
      <CardComponent title="Card title mock">any description text treat as children</CardComponent>,
    );
    const element = getByText('any description text treat as children');

    // Then
    expect(element).toBeInTheDocument();
  });

  it('should render the card details (top, bottom)', () => {
    // When
    render(
      <CardComponent
        details={{
          bottom: { className: 'any-classname-bottom-mock', content: 'any-content-bottom-mock' },
          top: { className: 'any-classname-top-mock', content: 'any-content-top-mock' },
        }}
        title="Card title mock">
        any description text treat as children
      </CardComponent>,
    );

    // Then
    expect(CardDetailComponent).toHaveBeenCalledTimes(2);
    expect(CardDetailComponent).toHaveBeenNthCalledWith(
      1,
      {
        className: 'any-classname-bottom-mock',
        content: 'any-content-bottom-mock',
        dataTestId: 'CardComponent-detail-bottom',
      },
      undefined,
    );
    expect(CardDetailComponent).toHaveBeenNthCalledWith(
      2,
      {
        className: 'any-classname-top-mock',
        content: 'any-content-top-mock',
        dataTestId: 'CardComponent-detail-top',
      },
      undefined,
    );
  });

  it('should render the media', () => {
    // When
    render(
      <CardComponent
        media={{ alt: 'media-alt-mock', src: 'media-src-mock' }}
        title="Card title mock">
        any description text treat as children
      </CardComponent>,
    );

    // Then
    expect(CardMediaComponent).toHaveBeenCalledOnce();
    expect(CardMediaComponent).toHaveBeenCalledWith(
      {
        alt: 'media-alt-mock',
        src: 'media-src-mock',
      },
      undefined,
    );
  });

  it('should render the badges group', () => {
    // When
    render(
      <CardComponent badges={[{ label: 'any-badge-mock' }]} title="Card title mock">
        any description text treat as children
      </CardComponent>,
    );

    // Then
    expect(BadgesGroupComponent).toHaveBeenCalledOnce();
    expect(BadgesGroupComponent).toHaveBeenCalledWith(
      {
        item: [{ label: 'any-badge-mock' }],
      },
      undefined,
    );
  });
});
