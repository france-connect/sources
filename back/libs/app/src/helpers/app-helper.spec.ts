import { AppHelper } from './app-helper';

describe('shutdown', () => {
  it('should shutdown the app', () => {
    // Given
    const processExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((code) => code as never);

    // When
    AppHelper.shutdown();

    // Then
    expect(processExit).toHaveBeenCalledWith(1);
  });
});
