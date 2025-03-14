import { FormSpy } from 'react-final-form';

import { useScrollToElement } from '@fc/common';
import { renderWithFinalForm } from '@fc/testing-library';

import { FormErrorScrollComponent } from './form-error-scroll.component';

describe('FormErrorScrollComponent', () => {
  const scrollToElementMock = jest.fn();

  beforeEach(() => {
    // Given
    jest.mocked(useScrollToElement).mockImplementation(() => scrollToElementMock);
  });

  it('should match its snapshot', () => {
    // When
    const { container } = renderWithFinalForm(
      <FormErrorScrollComponent elementClassName={expect.any(String)} />,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render FormSpy mock with a subscription prop', () => {
    // Given
    const activeMock = Symbol('active-mock') as unknown as boolean;

    // When
    renderWithFinalForm(
      <FormErrorScrollComponent active={activeMock} elementClassName={expect.any(String)} />,
    );
    const { subscription } = jest.mocked(FormSpy).mock.calls[0][0];

    // Then
    expect(subscription).toStrictEqual({
      submitFailed: activeMock,
    });
  });

  it('should render FormSpy mock with a onChange prop', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent elementClassName={expect.any(String)} />);
    const { onChange } = jest.mocked(FormSpy).mock.calls[0][0];

    // Then
    expect(onChange).toBe(scrollToElementMock);
  });

  it('should call useScrollToElement when the component is render with classname parameter', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent elementClassName="any-elementClassname-mock" />);

    // Then
    expect(useScrollToElement).toHaveBeenCalledOnce();
    expect(useScrollToElement).toHaveBeenCalledWith('any-elementClassname-mock');
  });

  it('should call useScrollToElement when FormSpy onChange is called', () => {
    // When
    renderWithFinalForm(<FormErrorScrollComponent elementClassName={expect.any(String)} />);
    const { onChange } = jest.mocked(FormSpy).mock.calls[0][0] as { onChange: () => void };
    onChange();

    // Then
    expect(scrollToElementMock).toHaveBeenCalledOnce();
  });
});
