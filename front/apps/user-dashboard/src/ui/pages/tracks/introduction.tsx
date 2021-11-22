import './introduction.scss';

export const IntroductionComponent = () => {
  return (
    <div className="introduction">
      <h4 className="is-blue-france mb8">
        <b>Votre historique de connexion</b>
      </h4>
      <p className="is-normal fr-text">
        Retrouver toutes les connexions et échanges de données effectués via
        FranceConnect ces six derniers mois. Cliquez sur une connexion pour en
        afficher les détails.
      </p>
    </div>
  );
};

IntroductionComponent.displayName = 'IntroductionComponent';
