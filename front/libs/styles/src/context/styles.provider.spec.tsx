import { render } from '@testing-library/react';
import React from 'react';

import { StylesProvider } from './styles.provider';

describe('StylesProvider', () => {
  it('should match the snapshot', () => {
    // when
    const { container } = render(
      <StylesProvider>
        <div>Hello World</div>
      </StylesProvider>,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call getComputedStyle with nodeTarget defined param', () => {
    // given
    const getComputedStyleMock = jest.spyOn(window, 'getComputedStyle');

    // when
    render(
      <StylesProvider nodeTarget="any-document-selector">
        <div>Hello World</div>
      </StylesProvider>,
    );

    // then
    expect(getComputedStyleMock).toHaveBeenCalledWith(
      document.documentElement,
      'any-document-selector',
    );
  });

  it('should call setState with values from getComputedStyle', () => {
    // given
    const useStylesVariablesMock = new CSSStyleDeclaration();
    useStylesVariablesMock.setProperty('--color-primary', 'red');
    jest.spyOn(window, 'getComputedStyle').mockReturnValue(useStylesVariablesMock);

    const setStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([expect.any(Object), setStateMock]);

    // when
    render(
      <StylesProvider nodeTarget="any-document-selector">
        <div>Hello World</div>
      </StylesProvider>,
    );

    // then
    expect(setStateMock).toHaveBeenCalledWith(useStylesVariablesMock);
  });
});
