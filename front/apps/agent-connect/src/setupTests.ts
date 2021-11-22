/* istanbul ignore file */

/* eslint
  import/no-extraneous-dependencies: 0
*/

// tooling file

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// https://github.com/ant-design/ant-design/issues/21096#issuecomment-725301551
global.matchMedia =
  global.matchMedia ||
  function mockMatchMedia() {
    return {
      addListener: jest.fn(),
      matches: false,
      removeListener: jest.fn(),
    };
  };

/**
 *
 * Prevent jest warning
 * Avoid jsdom error message after submitting a form
 * https://github.com/jsdom/jsdom/issues/1937
 *
 */
const originalConsoleLogError = global.console.error;
global.console.error = (...args: any[]) => {
  const errorMessage = 'Not implemented: HTMLFormElement.prototype.submit';
  if (args && args[0].includes(errorMessage)) {
    return false;
  }
  originalConsoleLogError(...args);
  return true;
};
