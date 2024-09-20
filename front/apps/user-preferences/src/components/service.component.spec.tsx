import { ToggleInput } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { renderWithFinalForm } from '@fc/testing-library';

import { ServiceComponent } from './service.component';
import { ServiceImageComponent } from './service-image.component';

jest.mock('./service-image.component');
jest.mock('./service-switch-label.component');

describe('ServiceComponent', () => {
  // given
  const serviceMock = {
    active: false,
    image: 'any-image',
    isChecked: false,
    name: 'any-name',
    title: 'any-title',
    uid: 'any-uid',
  };

  beforeEach(() => {
    // @NOTE used to prevent useStylesVariables.useStylesContext to throw
    // useStylesContext requires to be into a StylesProvider context
    jest.mocked(useStylesVariables).mockReturnValueOnce([expect.any(Number), expect.any(Number)]);
  });

  it('should match the snapshot, in a desktop viewport', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    // when
    const { container } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    // when
    const { container } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call ServiceImageComponent with service param', () => {
    // when
    renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // then
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ service: serviceMock }),
      {},
    );
  });

  it('should call ServiceImageComponent with disabled as true and element should have the disabled class when service is not checked,', () => {
    // when
    const { getByTestId } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);
    const element = getByTestId('form-wrapper').firstChild;

    // then
    expect(element).toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      {},
    );
  });

  it('should call ServiceImageComponent with disabled as false and element should not have the disable class when service is not checked,', () => {
    // when
    const { getByTestId } = renderWithFinalForm(
      <ServiceComponent service={{ ...serviceMock, isChecked: true }} />,
    );
    const element = getByTestId('form-wrapper').firstChild;

    // then
    expect(element).not.toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: false }),
      {},
    );
  });

  it('should call ToggleInput with default params', () => {
    // when
    renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // then
    expect(ToggleInput).toHaveBeenCalledOnce();
    expect(ToggleInput).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'fr-mt-2w',
        disabled: false,
        initialValue: serviceMock.isChecked,
        label: expect.any(Function),
        legend: { checked: 'Autorisé', unchecked: 'Bloqué' },
        name: 'idpList.any-uid',
      }),
      {},
    );
  });

  describe('when is not allowed to be updated', () => {
    it('should set the disabled class on the service component', () => {
      // when
      const { getByTestId } = renderWithFinalForm(
        <ServiceComponent allowToBeUpdated={false} service={serviceMock} />,
      );
      const element = getByTestId(`service-component-${serviceMock.name}`);

      // then
      expect(element).toHaveClass('disabled');
    });

    it('should call ServiceImageComponent with disabled as true', () => {
      // when
      renderWithFinalForm(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />);

      // then
      expect(ServiceImageComponent).toHaveBeenCalledOnce();
      expect(ServiceImageComponent).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        {},
      );
    });

    it('should call ToggleInput with disabled as true', () => {
      // when
      renderWithFinalForm(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />);

      // then
      expect(ToggleInput).toHaveBeenCalledOnce();
      expect(ToggleInput).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
        {},
      );
    });
  });
});
