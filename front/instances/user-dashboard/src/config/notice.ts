import { MessageTypes } from '@fc/common';

import type { NoticeConfigInterface } from '../interfaces';

export const Notice: NoticeConfigInterface = {
  description:
    'Le compte YRIS n’est plus disponible depuis le 1er juillet 2026. Si vous utilisiez ce compte, nous vous invitons à créer ou utiliser une autre identité numérique afin de continuer à réaliser vos démarches.',
  enabled: true,
  link: {
    href: 'https://aide.franceconnect.gouv.fr/faq/comptes-identifiants/arret%20Yris/',
    label: 'Plus d’informations sur l’arrêt d’YRIS',
  },
  title: 'Arrêt d’YRIS.',
  type: MessageTypes.INFO,
};
