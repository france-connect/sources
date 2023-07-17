import { wait } from './wait';

describe('wait', () => {
  it('should wait for the specified amount of time', async () => {
    const start = Date.now();
    await wait(1000);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(1000);
  });
});
