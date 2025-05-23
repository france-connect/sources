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

import { expect } from '@jest/globals';
// @NOTE are we still using more than this one into tests ?
import { toBeFalse, toBeTrue, toHaveBeenCalledOnce, toThrowWithMessage } from 'jest-extended';

expect.extend({
  toBeFalse,
  toBeTrue,
  toHaveBeenCalledOnce,
  toThrowWithMessage,
});
