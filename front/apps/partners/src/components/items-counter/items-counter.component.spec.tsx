import { render } from '@testing-library/react';

import { ItemsCounterComponent } from './items-counter.component';

jest.mock('@fc/dsfr');

const classNameMock = 'any-classname-mock';

describe('ItemsCounterComponent', () => {
  it('should match snapshot', () => {
    // when
    const { container } = render(
      <ItemsCounterComponent classname={classNameMock} count={1} total={2} />,
    );

    // then
    expect(container).toMatchSnapshot();
  });

  it('should call t element, when separator is undefined', () => {
    // when
    const { getByText } = render(<ItemsCounterComponent count={1} total={2} />);

    // then
    const element = getByText('ItemsCounterComponent.separator');
    expect(element).toBeInTheDocument();
  });

  it('should use classname when given in props', () => {
    // when
    const { container } = render(
      <ItemsCounterComponent classname={classNameMock} count={1} total={2} />,
    );

    // then
    expect(container.firstChild).toHaveClass(classNameMock);
  });
});
