import { renderWithFinalForm } from '@fc/tests-utils';

import { CheckboxInput } from './checkbox.input';

jest.mock('./checkbox.component');

describe('CheckboxInput', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = renderWithFinalForm(CheckboxInput, {
      label: 'any-label-mock',
      name: 'any-name-mock',
    });

    // then
    expect(container).toMatchSnapshot();
  });
});
