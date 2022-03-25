import { render } from '@testing-library/react';

import { FieldSwitchLegendComponent } from './field-switch-legend.component';

describe('FieldSwitchLegendComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have render with default active value', () => {
    // when
    const { getByText } = render(<FieldSwitchLegendComponent checked />);
    const element = getByText('activé');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render with default inactive value', () => {
    // when
    const { getByText } = render(<FieldSwitchLegendComponent checked={false} />);
    const element = getByText('désactivé');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render with default values', () => {
    // when
    const { getByText } = render(<FieldSwitchLegendComponent />);
    const element = getByText('désactivé');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the component class', () => {
    // when
    const { container } = render(
      <FieldSwitchLegendComponent
        checked={false}
        legend={{ active: 'checked-legend', inactive: 'unchecked-legend' }}
      />,
    );
    const element = container.firstChild;
    // then
    expect(element).toHaveClass('FieldSwitchInputComponent-legend');
    expect(element).toHaveClass('is-absolute');
  });

  it('should have the checked label', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent
        checked
        legend={{ active: 'checked-legend', inactive: 'unchecked-legend' }}
      />,
    );
    const element = getByText('checked-legend');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have the unchecked label', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent
        checked={false}
        legend={{ active: 'checked-legend', inactive: 'unchecked-legend' }}
      />,
    );
    const element = getByText('unchecked-legend');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render a single legend string', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent checked={false} legend="any-legend" />,
    );
    const element = getByText('any-legend');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render a legend with a callback, when checked', () => {
    // given
    const legendCallbackMock = jest.fn((value) => {
      if (value) return 'checked-value';
      return 'unchecked-value';
    });
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent checked legend={legendCallbackMock} />,
    );
    const element = getByText('checked-value');
    // then
    expect(legendCallbackMock).toHaveBeenCalledTimes(1);
    expect(legendCallbackMock).toHaveBeenCalledWith(true);
    expect(element).toBeInTheDocument();
  });

  it('should have render a legend with a callback, when not checked', () => {
    // given
    const legendCallbackMock = jest.fn((value) => {
      if (value) return 'checked-value';
      return 'unchecked-value';
    });
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent checked={false} legend={legendCallbackMock} />,
    );
    const element = getByText('unchecked-value');
    // then
    expect(legendCallbackMock).toHaveBeenCalledTimes(1);
    expect(legendCallbackMock).toHaveBeenCalledWith(false);
    expect(element).toBeInTheDocument();
  });

  it('should have render a active legend', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent
        checked
        legend={{ active: 'active-legend', inactive: 'inactive-legend' }}
      />,
    );
    const element = getByText('active-legend');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should have render a inactive legend', () => {
    // when
    const { getByText } = render(
      <FieldSwitchLegendComponent
        checked={false}
        legend={{ active: 'active-legend', inactive: 'inactive-legend' }}
      />,
    );
    const element = getByText('inactive-legend');
    // then
    expect(element).toBeInTheDocument();
  });
});
