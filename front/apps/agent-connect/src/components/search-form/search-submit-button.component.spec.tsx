import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { SearchSubmitButtonComponent } from './search-submit-button.component';

describe('SearchSubmitButtonComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useMediaQuery', () => {
    // when
    render(<SearchSubmitButtonComponent disabled={false} />);
    // then
    expect(useMediaQuery).toHaveBeenCalledTimes(1);
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should render the component for a desktop viewport', () => {
    // when
    const { getByTestId } = render(<SearchSubmitButtonComponent disabled={false} />);
    const elementLabel = getByTestId('label');
    const elementButton = getByTestId('button');
    // then
    expect(elementButton).toHaveClass('pl32');
    expect(elementLabel).not.toHaveClass('hide');
  });

  it('should render the component for a tablet viewport', () => {
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(<SearchSubmitButtonComponent disabled={false} />);
    const elementLabel = getByTestId('label');
    const elementButton = getByTestId('button');
    // then
    expect(elementButton).not.toHaveClass('pl32');
    expect(elementLabel).toHaveClass('hide');
  });

  it('should the button have a correct inner text', () => {
    // when
    const { getByText } = render(<SearchSubmitButtonComponent disabled={false} />);
    const textLabel = getByText('Rechercher');
    // then
    expect(textLabel).toBeInTheDocument();
  });

  it('should the button have a disabled attribute set to false', () => {
    // when
    const { getByTestId } = render(<SearchSubmitButtonComponent disabled={false} />);
    const elementButton = getByTestId('button');
    // then
    expect(elementButton).not.toHaveAttribute('disabled');
  });

  it('should the button have a disabled attribute set to true', () => {
    // when
    const { getByTestId } = render(<SearchSubmitButtonComponent disabled />);
    const elementButton = getByTestId('button');
    // then
    expect(elementButton).toHaveAttribute('disabled');
  });
});
