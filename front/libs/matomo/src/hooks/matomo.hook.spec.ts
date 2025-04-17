import { renderHook } from '@testing-library/react';

import { useMatomo } from './matomo.hook';

describe('useMatomo', () => {
  const urlMock = 'https://matomo-url.mock';
  const siteIdMock = 1234;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should add the Matomo script if it does not exist', () => {
    // Given

    // When
    renderHook(() => useMatomo({ siteId: siteIdMock, url: urlMock }));

    const addedScript = document.getElementById('matomo-script');

    // Then
    expect(addedScript).toBeTruthy();
    expect(addedScript?.tagName).toBe('SCRIPT');
    expect(addedScript?.innerHTML).toContain(urlMock);
    expect(addedScript?.innerHTML).toContain(siteIdMock.toString());
  });

  it('should not add the script if "matomo-script" id already exist', () => {
    // Given
    const existingScript = document.createElement('script');
    existingScript.id = 'matomo-script';
    document.body.appendChild(existingScript);

    // When
    renderHook(() => useMatomo({ siteId: siteIdMock, url: urlMock }));

    const addedScript = document.getElementById('matomo-script');

    // Then
    expect(addedScript).toBeTruthy();
    expect(addedScript?.innerHTML).not.toContain(urlMock);
    expect(addedScript?.innerHTML).not.toContain(siteIdMock.toString());
  });
});
