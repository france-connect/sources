import { Then } from 'cypress-cucumber-preprocessor/steps';

enum ViewportType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET_LANDSCAPE = 'tablet landscape',
  TABLET_PORTRAIT = 'tablet portrait',
}

interface Viewport {
  height: number;
  width: number;
}

type ViewportMap = Record<ViewportType, Viewport>;

const getViewport = (name: ViewportType): Viewport => {
  const viewports: ViewportMap = {
    desktop: {
      height: 900,
      width: 1440,
    },
    mobile: {
      height: 667,
      width: 375,
    },
    'tablet landscape': {
      height: 768,
      width: 1024,
    },
    'tablet portrait': {
      height: 1024,
      width: 768,
    },
  };
  return viewports[name];
};

Then("j'utilise un navigateur web sur {string}", function (viewportName) {
  const viewportType = viewportName as ViewportType;
  const { height, width } = getViewport(viewportType);
  cy.viewport(width, height);
});
