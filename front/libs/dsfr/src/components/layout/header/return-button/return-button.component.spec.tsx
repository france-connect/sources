import { render } from '@testing-library/react';

import { ReturnButtonComponent } from './return-button.component';
import { useReturnButton } from './use-return-button.hook';

jest.mock('./use-return-button.hook');

describe('ReturnButtonComponent', () => {
  // givent
  const useReturnButtonMock = {
    historyBackURL: 'any-historyBackURL-mock',
    serviceProviderName: 'any-serviceProviderName-mock',
    showButton: true,
  };

  it('should match the snapshot, when isMobileViewport is false', () => {
    // given
    jest.mocked(useReturnButton).mockReturnValueOnce(useReturnButtonMock);

    // when
    const { container } = render(<ReturnButtonComponent url="any-url-mock" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when isMobileViewport is true', () => {
    // given
    jest.mocked(useReturnButton).mockReturnValueOnce(useReturnButtonMock);

    // when
    const { container } = render(<ReturnButtonComponent isMobileViewport url="any-url-mock" />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when showButton is false', () => {
    // given
    jest.mocked(useReturnButton).mockReturnValueOnce({ ...useReturnButtonMock, showButton: false });

    // when
    const { container } = render(<ReturnButtonComponent url="any-url-mock" />);

    // then
    expect(container).toMatchSnapshot();
  });
});
