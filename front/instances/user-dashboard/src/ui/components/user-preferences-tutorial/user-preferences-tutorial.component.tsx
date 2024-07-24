import classnames from 'classnames';
import React from 'react';

import { useStylesQuery, useStylesVariables } from '@fc/styles';

import styles from './user-preferences-tutorial.module.scss';

interface UserPreferencesTutorialComponentProps {
  label: string;
  alt: string;
  img: string;
  className?: string | undefined;
}

export const UserPreferencesTutorialComponent: React.FC<UserPreferencesTutorialComponentProps> =
  React.memo(({ alt, className, img, label }: UserPreferencesTutorialComponentProps) => {
    const [breakpointMd, breakpointLg] = useStylesVariables(['breakpoint-md', 'breakpoint-lg']);

    const gtTablet = useStylesQuery({ minWidth: breakpointMd });
    const gtDesktop = useStylesQuery({ minWidth: breakpointLg });

    return (
      <div
        className={classnames(styles.tutorial, className, {
          [styles.tutorialFullWidth]: !gtDesktop,
          [styles.tutorialSmallWidth]: gtDesktop,
        })}
        data-testid="user-preferences-tutorial-container">
        <strong className="fr-text--md is-block fr-mb-1w">{label}</strong>
        <img
          alt={alt}
          className={classnames('shadow-bottom', {
            [styles.tutorialFullWidth]: !gtTablet,
            [styles.tutorialSmallWidth]: gtTablet,
          })}
          data-testid="user-preferences-tutorial-img"
          src={img}
        />
      </div>
    );
  });

UserPreferencesTutorialComponent.displayName = 'UserPreferencesTutorialComponent';
