import { renderWithFinalForm } from '@fc/tests-utils';

import { ToggleInput } from './toggle.input';

jest.mock('./toggle-input.component');
jest.mock('./toggle-label.component');

describe('ToggleInput', () => {
  it('should match the snapshot', () => {
    // When
    const { container } = renderWithFinalForm(ToggleInput, {
      label: 'any-label-mock',
      name: 'any-name-mock',
    });

    // Then
    expect(container).toMatchSnapshot();
  });
});
