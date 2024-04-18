/* istanbul ignore file */

/* ------------------------------------------------------
 *
 * Jest matchers/plugins setup file
 *
  ------------------------------------------------------ */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { toBeFalse, toBeTrue, toHaveBeenCalledOnce, toThrowWithMessage } from 'jest-extended';

// @NOTE are we still using more than this one into tests ?
expect.extend({
  toBeFalse,
  toBeTrue,
  toHaveBeenCalledOnce,
  toThrowWithMessage,
});
