import { When } from '@badeball/cypress-cucumber-preprocessor';

import FooterComponent from '../../pages/footer-component';

const footerComponent = new FooterComponent();

When(
  'je clique sur le lien {string} dans le footer',
  function (linkLabel: string) {
    return footerComponent.getFooterLinkByLabel(linkLabel).click();
  },
);
