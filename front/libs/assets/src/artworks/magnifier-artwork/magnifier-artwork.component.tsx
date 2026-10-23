import classnames from 'classnames';
import React from 'react';

import styles from './magnifier-artwork.module.scss';

export const MagnifierArtworkComponent = React.memo(() => (
  <svg
    aria-hidden="true"
    className={classnames('fr-responsive-img', styles.artwork)}
    data-testid="MagnifierArtworkComponent"
    viewBox="0 0 300 260"
    xmlns="http://www.w3.org/2000/svg">
    <rect className={styles.page} height="168" rx="10" width="216" x="42" y="38" />
    <rect className={styles.bar} height="26" rx="10" width="216" x="42" y="38" />
    <rect className={styles.bar} height="12" width="216" x="42" y="52" />
    <circle className={styles.dot} cx="58" cy="51" r="3.5" />
    <circle className={styles.dot} cx="70" cy="51" r="3.5" />
    <text className={styles.code} x="150" y="134">
      404
    </text>
    <text className={styles.note} x="150" y="160">
      PAGE INTROUVABLE
    </text>
    <rect className={styles.line} height="7" rx="3.5" width="148" x="76" y="176" />
    <rect className={styles.line} height="7" rx="3.5" width="104" x="98" y="190" />
    <ellipse className={styles.shadow} cx="0" cy="0" rx="34" ry="9" />
    <g className={styles.glass} data-testid="MagnifierArtworkComponent-glass">
      <g className={styles.wobble}>
        <line className={styles.handle} x1="24" x2="62" y1="24" y2="62" />
        <circle className={styles.ring} r="32" />
        <path className={styles.glint} d="M-18 -10 A22 22 0 0 1 -6 -21" />
        <text className={styles.question} y="12">
          ?
        </text>
      </g>
    </g>
  </svg>
));

MagnifierArtworkComponent.displayName = 'MagnifierArtworkComponent';
