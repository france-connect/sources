import { render } from '@testing-library/react';

import { FieldsetElement } from './fieldset.element';

describe('FieldsetElement', () => {
  it('should match the snapshot without parameters', () => {
    // When
    const ChildElementMock = jest.fn(() => <div>children-mock</div>);
    const { container, getByRole, getByText } = render(
      <FieldsetElement name="any-name-mock">
        <ChildElementMock />
      </FieldsetElement>,
    );
    const fieldsetElt = getByRole('group');
    const childElt = getByText('children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(fieldsetElt).toBeInTheDocument();
    expect(fieldsetElt).toHaveAttribute('id', 'any-name-mock');
    expect(fieldsetElt).toHaveClass('fr-fieldset');
    expect(fieldsetElt).toHaveAttribute(
      'aria-labelledby',
      'any-name-mock-legend any-name-mock-messages',
    );
    expect(childElt).toBeInTheDocument();
    expect(ChildElementMock).toHaveBeenCalledOnce();
    expect(ChildElementMock).toHaveBeenCalledWith({}, {});
  });

  it('should match the snapshot with parameters', () => {
    // When
    const ChildElementMock = jest.fn(() => <div>children-mock</div>);
    const { container, getByRole, getByText } = render(
      <FieldsetElement hasError isValid className="any-classname-mock" name="any-name-mock">
        <ChildElementMock />
      </FieldsetElement>,
    );
    const fieldsetElt = getByRole('group');
    const childElt = getByText('children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(fieldsetElt).toBeInTheDocument();
    expect(fieldsetElt).toHaveAttribute('id', 'any-name-mock');
    expect(fieldsetElt).toHaveClass('fr-fieldset');
    expect(fieldsetElt).toHaveClass('any-classname-mock');
    expect(fieldsetElt).toHaveClass('fr-fieldset--error');
    expect(fieldsetElt).toHaveClass('fr-fieldset--valid');
    expect(fieldsetElt).toHaveAttribute(
      'aria-labelledby',
      'any-name-mock-legend any-name-mock-messages',
    );
    expect(childElt).toBeInTheDocument();
    expect(ChildElementMock).toHaveBeenCalledOnce();
    expect(ChildElementMock).toHaveBeenCalledWith({}, {});
  });
});
