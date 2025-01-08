import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';
import type { To } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { HeadingTag } from '@fc/common';

import { CardBackgrounds, Sizes } from '../../enums';
import type { BadgeInterface, MediaInterface } from '../../interfaces';
import { BadgesGroupComponent } from '../badges-group';
import { CardDetailComponent } from './detail';
import { CardMediaComponent } from './media/card.media';

interface CardComponentDetail {
  // @TODO
  // use a namespace interface
  // to not have a duplicate interface between detail and this one
  content: string | undefined;
  className?: string | undefined;
}

interface CardComponentDetails {
  top?: CardComponentDetail | undefined;
  bottom?: CardComponentDetail | undefined;
}

interface CardComponentProps extends PropsWithChildren {
  title: string;
  enlargeLink?: boolean;
  size?: Sizes;
  media?: MediaInterface;
  background?: CardBackgrounds | undefined;
  details?: CardComponentDetails | undefined;
  isHorizontal?: boolean;
  Heading?: HeadingTag;
  link?: To | undefined;
  badges?: BadgeInterface[] | undefined;
  className?: string | undefined;
}

export const CardComponent = React.memo(
  ({
    Heading = HeadingTag.H3,
    background = CardBackgrounds.NO_BACKGROUND,
    badges,
    children: description,
    className,
    details,
    enlargeLink = false,
    isHorizontal = false,
    link = '#',
    media,
    size = Sizes.MEDIUM,
    title,
  }: CardComponentProps) => (
    <div
      className={classnames(
        `fr-card fr-card--${size} fr-card--${background}`,
        {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-card--horizontal': isHorizontal,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-enlarge-link': enlargeLink,
        },
        className,
      )}
      data-testid="CardComponent">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <Heading className="fr-card__title" data-testid="CardComponent-title">
            <Link to={link}>{title}</Link>
          </Heading>
          <p className="fr-card__desc">{description}</p>
          {details?.bottom && details?.bottom.content && (
            <div className="fr-card__end">
              <CardDetailComponent
                className={details.bottom.className}
                content={details.bottom.content}
                dataTestId="CardComponent-detail-bottom"
              />
            </div>
          )}
          <div className="fr-card__start">
            {media && <CardMediaComponent alt={media.alt} src={media.src} />}
            {badges && <BadgesGroupComponent item={badges} />}
            {details?.top && details?.top.content && (
              <CardDetailComponent
                className={details.top.className}
                content={details.top.content}
                dataTestId="CardComponent-detail-top"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ),
);

CardComponent.displayName = 'CardComponent';
