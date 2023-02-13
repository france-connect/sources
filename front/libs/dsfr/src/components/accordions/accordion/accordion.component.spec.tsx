import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { HeadingTag } from '@fc/common';

import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  // given
  const onAccordionClickMock = jest.fn();
  const useIdMock = jest.spyOn(React, 'useId');

  beforeEach(() => {
    // given
    jest.mocked(useIdMock).mockReturnValue('any-localeid-mock');
  });

  it('should match the snapshot with default props', () => {
    // when
    const { container } = render(
      <AccordionComponent title="accordion title mock" onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when element is passed in props', () => {
    // Given
    const element = <div>ELEMENT PROPS</div>;
    // When
    const { container } = render(
      <AccordionComponent
        element={element}
        title="accordion title mock"
        onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when element or children are not defined', () => {
    // When
    const { container } = render(
      <AccordionComponent title="accordion title mock" onClick={onAccordionClickMock} />,
    );
    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when Accordion is opened', () => {
    // When
    const { container } = render(
      <AccordionComponent opened title="accordion title mock" onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot when heading level is defined', () => {
    // When
    const { container } = render(
      <AccordionComponent
        heading={HeadingTag.H6}
        title="accordion title mock"
        onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    // Then
    expect(container).toMatchSnapshot();
  });

  it('should trigger onClick props when clicking on Accordion component', () => {
    // When
    const { getByRole } = render(
      <AccordionComponent title="accordion title mock" onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    // Then
    expect(onAccordionClickMock).toHaveBeenCalledTimes(1);
  });

  it('should add classname on section element if it is in props', () => {
    // Given
    const classnameMock = 'classnameMock';
    // When
    const { container } = render(
      <AccordionComponent
        className={classnameMock}
        title="accordion title mock"
        onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    // Then
    expect(container.firstChild).toHaveClass(classnameMock);
  });

  it('should add classname to heading element', () => {
    // Given
    const classnameMock = 'heading-classname-mock';
    // When
    const { getByTestId } = render(
      <AccordionComponent
        headingClassname={classnameMock}
        title="accordion title mock"
        onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    const element = getByTestId('AccordionComponent-heading');

    // Then
    expect(element).toHaveClass('heading-classname-mock');
  });

  it('should add classname to title element', () => {
    // Given
    const classnameMock = 'title-classname-mock';
    // When
    const { getByTestId } = render(
      <AccordionComponent
        title="accordion title mock"
        titleClassname={classnameMock}
        onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    const element = getByTestId('AccordionComponent-title');

    // Then
    expect(element).toHaveClass('title-classname-mock');
  });

  it('should call onClick callback with id user click the accordion button, the id is defined', () => {
    // Given
    const id = 'any-id-mock';
    // When
    const { getByTestId } = render(
      <AccordionComponent id={id} title="accordion title mock" onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    const titleBtnElement = getByTestId('AccordionComponent-title');
    fireEvent.click(titleBtnElement);

    // Then
    expect(onAccordionClickMock).toHaveBeenCalledWith(id);
  });

  it('should call onClick callback when user click the accordion button,', () => {
    // Given
    const localDefinedId = 'any-localedefinedid-mock';
    jest.mocked(useIdMock).mockReturnValue(localDefinedId);

    // When
    const { getByTestId } = render(
      <AccordionComponent title="accordion title mock" onClick={onAccordionClickMock}>
        Children
      </AccordionComponent>,
    );
    const titleBtnElement = getByTestId('AccordionComponent-title');
    fireEvent.click(titleBtnElement);

    // Then
    expect(onAccordionClickMock).toHaveBeenCalledWith('any-localedefinedid-mock');
  });
});
