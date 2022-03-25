import { render } from '@testing-library/react';

import { FieldSwitchLabelComponent } from './field-switch-label.component';

describe('FieldSwitchLabelComponent', () => {
  // given
  const ChildMockComponent: React.FunctionComponent = jest.fn(() => <div>the child</div>);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render FieldSwitchLabelComponent with component class', () => {
    // when
    const { container } = render(
      <FieldSwitchLabelComponent checked={false} label="any-label" name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const element = container.firstChild as HTMLElement;
    // then
    expect(element).toHaveClass('FieldSwitchInputComponent-label');
  });

  it('should be a label element with the html for attribute sibling the html input', () => {
    // when
    const { container } = render(
      <FieldSwitchLabelComponent checked={false} label="any-label" name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const element = container.firstChild as HTMLElement;
    // then
    expect(element).toHaveAttribute('for', 'any-name');
    expect(element.tagName).toStrictEqual('LABEL');
  });

  it('should render the FieldSwitchLabelComponent child', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLabelComponent checked={false} label="any-label" name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const element = getByText('the child');
    // then
    expect(element).toBeInTheDocument();
    expect(ChildMockComponent).toHaveBeenCalledTimes(1);
  });

  it('should render the name props as first child with class', () => {
    // when
    const { container, getByText } = render(
      <FieldSwitchLabelComponent rtl checked={false} label="any-label" name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const firstChild = container.firstChild?.firstChild;
    const element = getByText('any-label');
    // then
    expect(element).toStrictEqual(firstChild);
    expect(element).toHaveClass('mr24');
  });

  it('should render the name props as last container child with class', () => {
    // when
    const { container, getByText } = render(
      <FieldSwitchLabelComponent checked={false} label="any-label" name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const lastChild = container.firstChild?.lastChild;
    const element = getByText('any-label');
    // then
    expect(element).toStrictEqual(lastChild);
    expect(element).toHaveClass('ml24');
  });

  it('should have render the label from an object, when unchecked', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLabelComponent checked={false} label={() => 'unchecked-label'} name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const element = getByText('unchecked-label');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render the label from an object, when checked', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLabelComponent checked label={() => 'checked-label'} name="any-name">
        <ChildMockComponent />
      </FieldSwitchLabelComponent>,
    );
    const element = getByText('checked-label');
    // then
    expect(element).toBeInTheDocument();
  });
});
