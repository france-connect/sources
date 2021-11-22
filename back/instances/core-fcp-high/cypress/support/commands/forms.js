/* eslint-disable complexity */
import { getTotp } from './totp';

/**
 * Fill _totp field if it exists, according to configuration flag
 * IF totp flag is set to true, a correct totp will fill the field
 * Otherwise, a wrong code (000000) will fill the field
 * Warning You should await this function !
 *
 * @param {object?} subject the previous cypress object that call totp
 * @param {object} configuration Configuration object from test suite
 * @param {string} secret Secret for TOTP generator
 * @return {Promise}
 * @exports
 * @example cy.formFillTotp({ totp: true }, 'ZAERZRERAZAZEZA');
 * @example cy.formFillTotp({ totp: true });
 */

 export function totp(subject, arg1, arg2) {
  // the subject can be : the input element, a undefined element or ignore and be the first argument of your call
  const hasSubject = typeof subject === 'object' && 'prevObject' in subject;
  // we inject the arguments based on the possible existence of the subject element
  const input = hasSubject ? subject : 'input[name="_totp"]';
  const configuration =
    (hasSubject || subject === undefined ? arg1 : subject) || {};
  const secret =
    (hasSubject || subject === undefined ? arg2 : arg1) || `${Cypress.env('SECRET_TOTP')}`;

  if (configuration.totp === false) {
    return formType(input, '000000', configuration);
  }

  cy.wrap(getTotp(secret)).as('totp:token');
  cy.get('@totp:token').then(token => formType(input, token, configuration));
}

/**
 * Set the value of a text input or textarea
 * According to `fast` and `typeEvent` configuration options.
 * If `fast` is true (default), field will be filled with `value` instantly (jquery input.val())
 * If `fast` is false, field will be filled with `value` char by char (cy.type())
 * If `typeEvent` is true, events will be triggered while filling the value
 *   Triggered events are: keydown, keyup, input, change
 *   keydown is triggered before the change of value
 * If `typeEvent` is false (default) no event will be trigered
 * Note : triggering events may be usefull for some case, like testing form input control,
 * but while it is faster that the native cy.type(), not trigerring events is even faster.
 *
 * @param {string} selector Target input selector
 * @param {string} value
 * @param {object} config Should we fill fast or not
 * @return {promise}
 * @exports
 * @example cy.formType('#myId', 'foo');
 * @example cy.formType(cy.get('#myId'), 'foo', { typeEvent: true });
 * @example cy.formType('#myId', 'foo', { fast: true, typeEvent: true });
 */
 export function formType(input, value, config = { fast: true }) {
  const isCypress = typeof input === 'object' && 'chainerId' in input;
  const cyInput = isCypress ? input : cy.get(input);

  if (config.fast === false) {
    return cyInput.clear().type(value);
  }

  if (config.typeEvent) {
    return cyInput
      .trigger('keydown')
      .invoke('val', value)
      .trigger('keyup')
      .trigger('input')
      .trigger('change');
  }

  return cyInput.invoke('val', value);
}

/**
 * Fills a form from an object
 *
 * @param {object} inputs key:value map of form inputs
 * @param {object} configuration Configuration object from test suite
 * @return {void}
 * @exports
 * @example cy.formFill({ foo: 'foo', bar: 'bar'}, { fast: true });
 */
export function formFill(inputs, configuration) {
  Object.keys(inputs).forEach(inputName => {
    const value = String(inputs[inputName]);
    const selector = `[name="${inputName}"]`;
    const input = cy.get(selector);
    input.then($input => {
      switch ($input.prop('tagName')) {
        case 'TEXTAREA':
        case 'INPUT':
          if (['checkbox', 'radio'].indexOf($input.attr('type')) > -1) {
            // eslint-disable-next-line max-depth
            if (value) {
              return input.check({ force: true });
            }
            return input.uncheck({ force: true });
          }

          return formType(input, value, configuration);

        case 'SELECT':
          return input.select(value);

        default:
          return input;
      }
    });
  });

  if (typeof configuration.totp !== 'undefined') {
    cy.get('input[name="_totp"]').then(() => totp(configuration));
  }
}
