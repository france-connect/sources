import { render } from '@testing-library/react';

import { ComponentTypes } from '../../../enums';
import { GroupElement } from './group.element';

describe('GroupElement', () => {
  it('should match the snapshot without parameters', () => {
    // Given
    const ChildComponentMock = jest.fn(() => <div>children-mock</div>);

    // When
    const { container, getByText } = render(
      <GroupElement type={ComponentTypes.INPUT}>
        <ChildComponentMock />
      </GroupElement>,
    );
    const childElt = getByText('children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-input-group');
    expect(childElt).toBeInTheDocument();
    expect(ChildComponentMock).toHaveBeenCalledOnce();
    expect(ChildComponentMock).toHaveBeenCalledWith({}, undefined);
  });

  it('should match the snapshot with parameters', () => {
    // Given
    const ChildComponentMock = jest.fn(() => <div>children-mock</div>);

    // When
    const { container, getByText } = render(
      <GroupElement
        disabled
        hasError
        isValid
        className="any-classname-mock"
        type={ComponentTypes.INPUT}>
        <ChildComponentMock />
      </GroupElement>,
    );
    const childElt = getByText('children-mock');

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('fr-input-group');
    expect(container.firstChild).toHaveClass('any-classname-mock');
    expect(container.firstChild).toHaveClass('fr-input-group--disabled');
    expect(container.firstChild).toHaveClass('fr-input-group--error');
    expect(container.firstChild).toHaveClass('fr-input-group--valid');
    expect(childElt).toBeInTheDocument();
    expect(ChildComponentMock).toHaveBeenCalledOnce();
    expect(ChildComponentMock).toHaveBeenCalledWith({}, undefined);
  });
});
