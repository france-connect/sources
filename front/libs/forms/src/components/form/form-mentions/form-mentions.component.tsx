import React from 'react';

export const FormMentionsComponent = React.memo(() => (
  <div>
    <p className="fr-text--xs">
      La Direction du Numérique (DINUM) traite les données à caractère personnel recueillies par le
      biais de ce formulaire pour assister les usagers sur l’utilisation du téléservice «
      FranceConnect ».
      <br />
      Pour en savoir plus sur la gestion de vos données personnelles et pour exercer vos droits,
      nous vous invitons à consulter notre Politique de confidentialité ci-dessous.
    </p>
  </div>
));

FormMentionsComponent.displayName = 'FormMentionsComponent';
