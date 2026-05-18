import { wait } from './wait';

describe('wait', () => {
  it('should wait for the specified amount of time', async () => {
    const start = Date.now();
    await wait(1000);
    const end = Date.now();
    /**
     * Deferring is not perfectly accurate, so we check that at least 999ms so that when timer differ by 1ms
     * due to the way setTimeout works and the event loop scheduling, the test will not fail.
     */
    expect(end - start).toBeGreaterThanOrEqual(999);
  });
});
