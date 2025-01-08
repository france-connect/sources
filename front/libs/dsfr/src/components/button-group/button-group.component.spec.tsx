import { render } from '@testing-library/react';

import { SimpleButton } from '../buttons';
import { ButtonGroupComponent } from './button-group.component';

jest.mock('../buttons/simple/simple.button');

describe('ButtonGroupComponent', () => {
  it('should match snapshot with default props', () => {
    // When
    const { container } = render(
      <ButtonGroupComponent>
        <SimpleButton>précédent</SimpleButton>
        <SimpleButton>suivant</SimpleButton>
      </ButtonGroupComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btns-group');
    expect(container.firstChild).toHaveClass('fr-btns-group--inline-md');
    expect(container.firstChild).not.toHaveClass('fr-btns-group--equisized');
    expect(SimpleButton).toHaveBeenCalledTimes(2);
  });

  it('should match snapshot with all props', () => {
    // When
    const { container } = render(
      <ButtonGroupComponent equisized inline={false}>
        <SimpleButton>précédent</SimpleButton>
        <SimpleButton>suivant</SimpleButton>
      </ButtonGroupComponent>,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btns-group');
    expect(container.firstChild).toHaveClass('fr-btns-group--equisized');
    expect(container.firstChild).toHaveClass('fr-btns-group--md');
    expect(SimpleButton).toHaveBeenCalledTimes(2);
  });
});
