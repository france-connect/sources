import { render } from '@testing-library/react';

import { SimpleButton } from '../buttons';
import { ButtonGroupComponent } from './button-group.component';

jest.mock('../buttons/simple/simple.button');

describe('ButtonGroupComponent', () => {
  it('should match snapshot with default props', () => {
    // when
    const { container } = render(
      <ButtonGroupComponent>
        <SimpleButton label="précédent" />
        <SimpleButton label="suivant" />
      </ButtonGroupComponent>,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btns-group');
    expect(container.firstChild).toHaveClass('fr-btns-group--inline-md');
    expect(container.firstChild).not.toHaveClass('fr-btns-group--equisized');
    expect(SimpleButton).toHaveBeenCalledTimes(2);
  });

  it('should match snapshot with all props', () => {
    // when
    const { container } = render(
      <ButtonGroupComponent equisized inline={false}>
        <SimpleButton label="précédent" />
        <SimpleButton label="suivant" />
      </ButtonGroupComponent>,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-btns-group');
    expect(container.firstChild).toHaveClass('fr-btns-group--equisized');
    expect(container.firstChild).toHaveClass('fr-btns-group--md');
    expect(SimpleButton).toHaveBeenCalledTimes(2);
  });
});
