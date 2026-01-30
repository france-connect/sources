import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import CommonPage from '../pages/common-page';

const SKIPLINK_TARGETS = {
  'contenu principal': {
    href: '#main-content',
    text: 'Contenu',
  },
  'pied de page': {
    href: '#footer',
    text: 'Pied de page',
  },
};

const commonPage = new CommonPage();

When("je vérifie la présence des liens d'évitements FranceConnect", () => {
  commonPage.getSkiplinks().should('be.visible');
});

Then("les liens d'évitements sont présents sur la page", () => {
  commonPage.getSkiplinks().should('exist');
  commonPage.getSkiplinksList().should('exist');
  commonPage.getSkiplinksItems().should('have.length.at.least', 1);
});

Then(
  /^les liens d'évitements contiennent un lien vers le (contenu principal|pied de page)$/,
  (destination: string) => {
    const target = SKIPLINK_TARGETS[destination];

    commonPage
      .getSkiplinksItems()
      .filter(`[href="${target.href}"]`)
      .should('exist')
      .and('contain.text', target.text);
  },
);

When(
  "je simule l'utilisation d'un outil d'accessibilité en naviguant avec Tab",
  () => {
    commonPage.getSkiplinksItems().first().focus();
    commonPage.getSkiplinks().should('be.visible');
  },
);

Then("les liens d'évitements deviennent visibles", () => {
  commonPage.getSkiplinksItems().first().should('have.focus');

  commonPage.getSkiplinks().should('be.visible');

  commonPage.getSkiplinksItems().first().should('be.visible');
});

Then("le premier élément en focus est un lien d'évitement", () => {
  commonPage.getFocusedElement().should('exist');
  commonPage.getFocusedElement().should('have.class', 'fr-link');

  commonPage.getFocusedElement().should('exist');

  commonPage.getSkiplinksItems().first().should('have.focus');
});

When(
  /^je clique sur le lien d'évitement vers le (contenu principal|pied de page)$/,
  (destination: string) => {
    const target = SKIPLINK_TARGETS[destination];

    commonPage.getSkiplinksItems().first().focus();
    commonPage.getSkiplinks().should('be.visible');

    commonPage
      .getSkiplinksItems()
      .filter(`[href="${target.href}"]`)
      .should('be.visible')
      .click();
  },
);

Then('le focus est déplacé vers le contenu principal', () => {
  commonPage.getMainContent().should('exist');
  cy.url().should('include', '#main-content');
  commonPage.getMainContent().checkWithinViewport(true);
});

Then(
  "les liens d'évitements ont l'attribut {string} avec la valeur {string}",
  (attribute: string, value: string) => {
    commonPage.getSkiplinks().find('nav').should('have.attr', attribute, value);
  },
);

Then(
  "chaque lien d'évitement a la classe CSS {string}",
  (className: string) => {
    commonPage.getSkiplinksItems().each(($link) => {
      cy.wrap($link).should('have.class', className);
    });
  },
);

Then('le focus est déplacé vers le pied de page', () => {
  commonPage.getFooter().should('exist');
  cy.url().should('include', '#footer');
  commonPage.getFooter().checkWithinViewport(true);
});
