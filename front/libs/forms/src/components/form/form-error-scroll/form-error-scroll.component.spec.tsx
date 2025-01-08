import { FormSpy } from 'react-final-form';

import { useScrollToElement } from '@fc/common';
import { renderWithFinalForm } from '@fc/testing-library';

import { FormErrorScrollComponent } from './form-error-scroll.component';

describe('FormErrorScrollComponent', () => {
  const scrollToMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useScrollToElement).mockImplementation(() => ({ scrollToElement: scrollToMock }));
  });

  it('should match its snapshot', () => {
    // When
    const { container } = renderWithFinalForm(<FormErrorScrollComponent />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render FormSpy mock with a subscription prop', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent />);
    const { subscription } = jest.mocked(FormSpy).mock.calls[0][0];

    // Then
    expect(subscription).toStrictEqual({
      modifiedSinceLastSubmit: true,
      submitFailed: true,
    });
  });

  it('should render FormSpy mock with a onChange prop', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent />);
    const { onChange } = jest.mocked(FormSpy).mock.calls[0][0];

    // Then
    expect(onChange).toBeInstanceOf(Function);
  });

  it('should call useScrollToElement when the component is render with classname parameter', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent />);

    // Then
    expect(useScrollToElement).toHaveBeenCalledOnce();
    expect(useScrollToElement).toHaveBeenCalledWith('.fr-message--error');
  });

  it('should call useScrollToElement when FormSpy onChange is called', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent />);
    const { onChange } = jest.mocked(FormSpy).mock.calls[0][0] as { onChange: () => void };
    onChange();

    // Then
    expect(scrollToMock).toHaveBeenCalledOnce();
  });
});
