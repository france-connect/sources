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
};
