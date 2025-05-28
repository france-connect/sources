import { ToggleInput } from '@fc/dsfr';
import { useStylesQuery, useStylesVariables } from '@fc/styles';
import { renderWithFinalForm } from '@fc/testing-library';

import { ServiceComponent } from './service.component';
import { ServiceImageComponent } from './service-image.component';

jest.mock('./service-image.component');
jest.mock('./service-switch-label.component');

describe('ServiceComponent', () => {
  // Given
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
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    jest.mocked(useStylesQuery).mockReturnValueOnce(true);
    // When
    const { container } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // Given
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    jest.mocked(useStylesQuery).mockReturnValueOnce(false);
    // When
    const { container } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // Then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call ServiceImageComponent with service param', () => {
    // When
    renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // Then
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ service: serviceMock }),
      undefined,
    );
  });

  it('should call ServiceImageComponent with disabled as true and element should have the disabled class when service is not checked,', () => {
    // When
    const { getByTestId } = renderWithFinalForm(<ServiceComponent service={serviceMock} />);
    const element = getByTestId('form-wrapper').firstChild;

    // Then
    expect(element).toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      undefined,
    );
  });

  it('should call ServiceImageComponent with disabled as false and element should not have the disable class when service is not checked,', () => {
    // When
    const { getByTestId } = renderWithFinalForm(
      <ServiceComponent service={{ ...serviceMock, isChecked: true }} />,
    );
    const element = getByTestId('form-wrapper').firstChild;

    // Then
    expect(element).not.toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledOnce();
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: false }),
      undefined,
    );
  });

  it('should call ToggleInput with default params', () => {
    // When
    renderWithFinalForm(<ServiceComponent service={serviceMock} />);

    // Then
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
      undefined,
    );
  });

  describe('when is not allowed to be updated', () => {
    it('should set the disabled class on the service component', () => {
      // When
      const { getByTestId } = renderWithFinalForm(
        <ServiceComponent allowToBeUpdated={false} service={serviceMock} />,
      );
      const element = getByTestId(`service-component-${serviceMock.name}`);

      // Then
      expect(element).toHaveClass('disabled');
    });

    it('should call ServiceImageComponent with disabled as true', () => {
      // When
      renderWithFinalForm(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />);

      // Then
      expect(ServiceImageComponent).toHaveBeenCalledOnce();
      expect(ServiceImageComponent).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        undefined,
      );
    });

    it('should call ToggleInput with disabled as true', () => {
      // When
      renderWithFinalForm(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />);

      // Then
      expect(ToggleInput).toHaveBeenCalledOnce();
      expect(ToggleInput).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
        undefined,
      );
    });
  });
});
