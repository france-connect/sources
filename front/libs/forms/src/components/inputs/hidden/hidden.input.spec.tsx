import { render } from '@testing-library/react';
import { Field } from 'react-final-form';

import { HiddenInput } from './hidden.input';

describe('HiddenInput', () => {
  beforeEach(() => {
    // Given
    jest.mocked(Field).mockImplementation(() => <div data-mockid="Field" />);
  });

  it('should match the snapshot', () => {
    // When
    const { container } = render(<HiddenInput name="name-mock" />);

    // Then
    expect(container).toMatchSnapshot();
    expect(Field).toHaveBeenCalledOnce();
    expect(Field).toHaveBeenCalledWith(
      {
        component: 'input',
        name: 'name-mock',
        type: 'hidden',
      },
      undefined,
    );
  });
});
