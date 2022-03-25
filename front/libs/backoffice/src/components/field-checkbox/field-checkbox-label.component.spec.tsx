import { render } from '@testing-library/react';
import { RiCheckLine } from 'react-icons/ri';

import { FieldCheckboxLabelComponent } from './field-checkbox-label.component';

describe('FieldCheckboxLabelComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be a label element with attribute for', () => {
    // when
    const { container } = render(
      <FieldCheckboxLabelComponent
        checked={false}
        disabled={false}
        label="any-label-mock"
        name="any-name-mock"
      />,
    );
    const element = container.firstChild as HTMLElement;
    // then
    expect(element.tagName).toStrictEqual('LABEL');
    expect(element).toHaveAttribute('for', 'any-name-mock');
  });

  it('should have a text', () => {
    // when
    const { getByText } = render(
      <FieldCheckboxLabelComponent
        checked={false}
        disabled={false}
        label="any-label-mock"
        name="any-name-mock"
      />,
    );
    const element = getByText('any-label-mock');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have an icon when checked and parent have classes', () => {
    // when
    const { container, getByTestId } = render(
      <FieldCheckboxLabelComponent checked disabled label="any-label-mock" name="any-name-mock" />,
    );
    const iconElement = getByTestId('check-icon');
    const boxElement = getByTestId('check-box');
    // then
    expect(RiCheckLine).toHaveBeenCalled();
    expect(container.firstChild).toHaveClass('disabled');
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).toHaveClass('bg-blue-france');
    expect(boxElement).toHaveClass('is-white');
    expect(boxElement).toStrictEqual(iconElement.parentNode);
  });

  it('should not have an icon when not checked and parent have not classes', () => {
    // when
    const { container, getByTestId } = render(
      <FieldCheckboxLabelComponent
        checked={false}
        disabled={false}
        label="any-label-mock"
        name="any-name-mock"
      />,
    );
    const boxElement = getByTestId('check-box');
    // then
    expect(RiCheckLine).not.toHaveBeenCalled();
    expect(container.firstChild).not.toHaveClass('disabled');
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).not.toHaveClass('bg-blue-france');
    expect(boxElement).not.toHaveClass('is-white');
  });

  it('should the first element be the label', () => {
    // when
    const { container, getByText } = render(
      <FieldCheckboxLabelComponent
        checked
        rtl
        disabled={false}
        label="any-label-mock"
        name="any-name-mock"
      />,
    );
    const element = getByText('any-label-mock');
    const firstElement = container?.firstChild?.firstChild;
    // then
    expect(firstElement).toStrictEqual(element);
    expect(firstElement).toHaveClass('mr12');
  });

  it('should the last element be the label', () => {
    // when
    const { container, getByText } = render(
      <FieldCheckboxLabelComponent
        checked
        disabled={false}
        label="any-label-mock"
        name="any-name-mock"
      />,
    );
    const element = getByText('any-label-mock');
    const lastElement = container?.firstChild?.lastChild;
    // then
    expect(lastElement).toStrictEqual(element);
    expect(lastElement).toHaveClass('ml12');
  });
});
