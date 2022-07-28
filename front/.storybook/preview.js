import '@gouvfr/dsfr/dist/dsfr/dsfr.css';
// Compile the SCSS files from our DSFR lib and inject them into the dom
import '!style-loader!css-loader!sass-loader!../libs/dsfr/src/styles/index.scss';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      desktop: {
        name: 'Desktop',
        styles: {
          height: '900px',
          width: '1440px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          height: '768px',
          width: '1024px',
        },
      },
      mobile: {
        name: 'Mobile',
        styles: {
          height: '667px',
          width: '375px',
        },
      },
    },
  },
};
