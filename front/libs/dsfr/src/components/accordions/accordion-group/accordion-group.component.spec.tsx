import { render } from '@testing-library/react';

import type { SelectedItemsHook } from '@fc/common';
import { useSelectedItems } from '@fc/common';

import { AccordionComponent } from '../accordion/accordion.component';
import { AccordionGroupComponent } from './accordion-group.component';

jest.mock('../accordion/accordion.component');

describe('AccordionGroupComponent', () => {
  // Given
  const onItemSelectMock = jest.fn();
  const accordion1 = {
    element: <div>AccordionComponentMock 1</div>,
    id: 'accordion-item-1',
    title: 'AccordionComponentMock 1',
  };
  const accordion2 = {
    className: 'classname-2',
    element: <div>AccordionComponentMock 2</div>,
    headingClassname: 'heading-classname-2',
    id: 'accordion-item-2',
    title: 'AccordionComponentMock 2',
    titleClassname: 'title-classname-2',
  };
  const accordion3 = {
    element: <div>AccordionComponentMock 3</div>,
    id: 'accordion-item-3',
    title: 'AccordionComponentMock 3',
  };
  const accordionItemsMock = [accordion1, accordion2, accordion3];

  it('should match the snapshot, with required props', () => {
    // When
    const { container } = render(<AccordionGroupComponent items={accordionItemsMock} />);

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, and container should have the custom classname', () => {
    // When
    const { container } = render(
      <AccordionGroupComponent
        className="accordion-group-custom-classname"
        items={accordionItemsMock}
      />,
    );

    // Then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('accordion-group-custom-classname');
  });

  it('should call useSelectedItems hook once', () => {
    // When
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    // Then
    expect(useSelectedItems).toHaveBeenCalledOnce();
  });

  it('should call useSelectedItems hook with options props', () => {
    // Given
    const options = Symbol('useSelectedItems_options_mock') as SelectedItemsHook<string>;

    // When
    render(<AccordionGroupComponent items={accordionItemsMock} options={options} />);

    // Then
    expect(useSelectedItems).toHaveBeenCalledOnce();
    expect(useSelectedItems).toHaveBeenCalledWith(options);
  });

  it('should call AccordionComponent 3 times with props', () => {
    // Given
    jest.mocked(useSelectedItems).mockReturnValueOnce({
      onItemSelect: onItemSelectMock,
      selected: [],
    });
    // When
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    expect(AccordionComponent).toHaveBeenCalledTimes(3);
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        element: accordion1.element,
        title: accordion1.title,
      }),
      undefined,
    );
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        className: accordion2.className,
        element: accordion2.element,
        headingClassname: 'heading-classname-2',
        title: accordion2.title,
        titleClassname: accordion2.titleClassname,
      }),
      undefined,
    );
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        element: accordion3.element,
        title: accordion3.title,
      }),
      undefined,
    );
  });

  it('should call AccordionComponent 3 times, second element will be opened at startup', () => {
    // Given
    jest.mocked(useSelectedItems).mockReturnValueOnce({
      onItemSelect: onItemSelectMock,
      selected: ['accordion-item-2'],
    });
    // When
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    // Then
    expect(AccordionComponent).toHaveBeenCalledTimes(3);
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        opened: true,
      }),
      undefined,
    );
  });
});
