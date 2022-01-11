import { fireEvent, render } from '@testing-library/react';

import { ButtonFranceConnectComponent } from './button-france-connect.component';

describe('ButtonFranceConnectComponent', () => {
  it('should render an element with a given classname', () => {
    // given
    const { container } = render(<ButtonFranceConnectComponent className="mock-classname" />);
    // then
    const elements = container.getElementsByClassName('mock-classname');
    expect(elements).toHaveLength(1);
  });

  it('should contain an svg button with defined title', () => {
    // given
    const { getByTitle } = render(<ButtonFranceConnectComponent />);
    // then
    const element = getByTitle("S'identifier avec France Connect");
    expect(element.tagName).toStrictEqual('svg');
    expect(element).toBeInTheDocument();
  });

  it('button defined property onClick should have been called', () => {
    // given
    const mockFunction = jest.fn();
    const { container } = render(<ButtonFranceConnectComponent onClick={mockFunction} />);
    // when
    const element = container.firstElementChild;
    fireEvent.click(element as Element);
    // then
    expect(mockFunction).toHaveBeenCalled();
  });

  it('button defined property type should have been set', () => {
    // given
    const { container } = render(<ButtonFranceConnectComponent type="submit" />);
    // when
    const element = container.firstElementChild;
    // then
    expect(element as Element).toHaveAttribute('type', 'submit');
  });
});
