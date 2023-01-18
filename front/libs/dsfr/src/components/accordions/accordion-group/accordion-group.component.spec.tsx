import { render } from '@testing-library/react';

import { SelectedItemsHook, useSelectedItems } from '@fc/common';

import { AccordionComponent } from '../accordion/accordion.component';
import { AccordionGroupComponent } from './accordion-group.component';

jest.mock('../accordion/accordion.component');

describe('AccordionGroupComponent', () => {
  // given
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
    // when
    const { container } = render(<AccordionGroupComponent items={accordionItemsMock} />);

    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, and container should have the custom classname', () => {
    // when
    const { container } = render(
      <AccordionGroupComponent
        className="accordion-group-custom-classname"
        items={accordionItemsMock}
      />,
    );

    // then
    expect(container).toMatchSnapshot();
    expect(container.firstChild).toHaveClass('accordion-group-custom-classname');
  });

  it('should call useSelectedItems hook once', () => {
    // when
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    // then
    expect(useSelectedItems).toHaveBeenCalledTimes(1);
  });

  it('should call useSelectedItems hook with options props', () => {
    // given
    const options = Symbol('useSelectedItems_options_mock') as SelectedItemsHook<string>;

    // when
    render(<AccordionGroupComponent items={accordionItemsMock} options={options} />);

    // then
    expect(useSelectedItems).toHaveBeenCalledTimes(1);
    expect(useSelectedItems).toHaveBeenCalledWith(options);
  });

  it('should call AccordionComponent 3 times with props', () => {
    // given
    jest.mocked(useSelectedItems).mockReturnValueOnce({
      onItemSelect: onItemSelectMock,
      selected: [],
    });
    // when
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    expect(AccordionComponent).toHaveBeenCalledTimes(3);
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        element: accordion1.element,
        title: accordion1.title,
      }),
      {},
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
      {},
    );
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        element: accordion3.element,
        title: accordion3.title,
      }),
      {},
    );
  });

  it('should call AccordionComponent 3 times, second element will be opened at startup', () => {
    // given
    jest.mocked(useSelectedItems).mockReturnValueOnce({
      onItemSelect: onItemSelectMock,
      selected: ['accordion-item-2'],
    });
    // when
    render(<AccordionGroupComponent items={accordionItemsMock} />);

    // then
    expect(AccordionComponent).toHaveBeenCalledTimes(3);
    expect(AccordionComponent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        opened: true,
      }),
      {},
    );
  });
});
