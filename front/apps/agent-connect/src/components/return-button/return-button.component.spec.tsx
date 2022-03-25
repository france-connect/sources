import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { ReturnButtonComponent } from './return-button.component';
import { useReturnButton } from './use-return-button.hook';

jest.mock('./use-return-button.hook');

describe('ReturnButtonComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useMediaQuery with tablet responsive query', () => {
    // then
    render(<ReturnButtonComponent />);
    // when
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should render the button for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTitle } = render(<ReturnButtonComponent />);
    const element = getByTitle('retourner à l’écran précédent');
    // then
    expect(element).not.toHaveClass('flex-end');
    expect(element).toHaveClass('bg-g200 is-mobile m16');
  });

  it('should render the button for a desktop viewport', () => {
    // when
    const { getByTitle } = render(<ReturnButtonComponent />);
    const element = getByTitle('retourner à l’écran précédent');
    // then
    expect(element).toHaveClass('flex-end');
    expect(element).not.toHaveClass('bg-g200 is-mobile m16');
  });

  it('should have render the button', () => {
    // when
    const { getByTitle } = render(<ReturnButtonComponent />);
    const element = getByTitle('retourner à l’écran précédent');
    // when
    expect(element).toBeInTheDocument();
  });

  it('should have not render the button', () => {
    // given
    mocked(useReturnButton).mockReturnValueOnce({
      historyBackURL: '/',
      serviceProviderName: 'service provider name mock',
      showButton: false,
    });
    // then
    const { queryByTitle } = render(<ReturnButtonComponent />);
    const element = queryByTitle('retourner à l’écran précédent');
    // when
    expect(element).not.toBeInTheDocument();
  });

  it('should have showned the service provider name', () => {
    // given
    mocked(useReturnButton).mockReturnValueOnce({
      historyBackURL: '/',
      serviceProviderName: 'service provider name mock',
      showButton: true,
    });
    // then
    const { getByText } = render(<ReturnButtonComponent />);
    const element = getByText('Revenir sur service provider name mock');
    // when
    expect(element).toBeInTheDocument();
  });
});
