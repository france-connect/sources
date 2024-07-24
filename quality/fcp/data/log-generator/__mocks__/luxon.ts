/* istanbul ignore file */

// Declarative code
const { DateTime } = jest.requireActual('luxon');

DateTime.now = jest
  .fn()
  .mockImplementation(() => DateTime.fromISO('2024-06-24T12:00:00.000+02:00'));

export { DateTime };
