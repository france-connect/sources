import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

import { HeadingTag } from '@fc/common';

import { Sizes } from '../../enums';

interface TileComponentProps extends PropsWithChildren {
  isHorizontal?: boolean;
  useDownload?: boolean | undefined;
  description?: string;
  dataTestId?: string | undefined;
  detail?: string;
  Heading?: HeadingTag;
  link: string;
  size?: Sizes;
  title: string;
}

// @TODO
// - force display mode (.fr-tile--vertical@md | fr-tile--horizonral@md)
// - use download button instead of line (.fr-enlarge-button)
// @SEE https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/tuile
export const TileComponent = React.memo(
  ({
    Heading = HeadingTag.H3,
    children: svgArtwork,
    dataTestId = 'TileComponent',
    description = undefined,
    detail = undefined,
    isHorizontal = false,
    link,
    size = Sizes.MEDIUM,
    title,
    useDownload = false,
  }: TileComponentProps) => (
    <div
      className={classnames(`fr-tile fr-tile--${size} fr-enlarge-link`, {
        // @NOTE CSS class
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-tile--download': useDownload,
        // @NOTE CSS class
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-tile--horizontal': isHorizontal,
      })}
      data-testid={dataTestId}>
      <div className="fr-tile__body">
        <div className="fr-tile__content">
          <Heading className="fr-tile__title" data-testid={`${dataTestId}-title`}>
            <Link download={useDownload} to={link}>
              {title}
            </Link>
          </Heading>
          {description && <p className="fr-tile__desc">{description}</p>}
          {detail && <p className="fr-tile__detail">{detail}</p>}
          {/* @TODO add badges / tags */}
        </div>
      </div>
      {svgArtwork && (
        <div className="fr-tile__header">
          <div className="fr-tile__pictogram">{svgArtwork}</div>
        </div>
      )}
    </div>
  ),
);

TileComponent.displayName = 'TileComponent';
