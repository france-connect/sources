import { render } from '@testing-library/react';
import React from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';

import { ToggleInput } from '@fc/dsfr';

import { ServiceComponent } from './service.component';
import { ServiceImageComponent } from './service-image.component';

jest.mock('@fc/dsfr');
jest.mock('react-responsive');
jest.mock('react-final-form-listeners');
jest.mock('./service-image.component');
jest.mock('./service-switch-label.component');

const Wrapper = ({ children }: { children: React.ReactElement }) => (
  <Form onSubmit={jest.fn()}>
    {({ handleSubmit }) => (
      <form data-testid="form-wrapper" onSubmit={handleSubmit}>
        {children}
      </form>
    )}
  </Form>
);

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

  it('should match the snapshot, in a desktop viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);
    jest.mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { container } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });

    // then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match the snapshot, in a mobile viewport', () => {
    // given
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);
    jest.mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });

    // then
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call ServiceImageComponent with service param', () => {
    // when
    render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });

    // then
    expect(ServiceImageComponent).toHaveBeenCalledTimes(1);
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ service: serviceMock }),
      {},
    );
  });

  it('should call ServiceImageComponent with disabled as true and element should have the disabled class when service is not checked,', () => {
    // when
    const { getByTestId } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });
    const element = getByTestId('form-wrapper').firstChild;

    // then
    expect(element).toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledTimes(1);
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true }),
      {},
    );
  });

  it('should call ServiceImageComponent with disabled as false and element should not have the disable class when service is not checked,', () => {
    // when
    const { getByTestId } = render(
      <ServiceComponent service={{ ...serviceMock, isChecked: true }} />,
      { wrapper: Wrapper },
    );
    const element = getByTestId('form-wrapper').firstChild;

    // then
    expect(element).not.toHaveClass('disabled');
    expect(ServiceImageComponent).toHaveBeenCalledTimes(1);
    expect(ServiceImageComponent).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: false }),
      {},
    );
  });

  it('should call ToggleInput with default params', () => {
    // when
    render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });

    // then
    expect(ToggleInput).toHaveBeenCalledTimes(1);
    expect(ToggleInput).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
        initialValue: serviceMock.isChecked,
        label: expect.any(Function),
        legend: { checked: 'Autorisé', unchecked: 'Bloqué' },
        name: 'idpList.any-uid',
      }),
      {},
    );
  });

  it('should call OnChange from react-final-form-listener with name param', () => {
    // when
    render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });

    // then
    expect(OnChange).toHaveBeenCalledTimes(1);
    expect(OnChange).toHaveBeenCalledWith(
      { children: expect.any(Function), name: 'idpList.any-uid' },
      {},
    );
  });

  describe('when is not allowed to be updated', () => {
    it('should set the disabled class on the service component', () => {
      // when
      const { getByTestId } = render(
        <ServiceComponent allowToBeUpdated={false} service={serviceMock} />,
        {
          wrapper: Wrapper,
        },
      );
      const element = getByTestId(`service-component-${serviceMock.name}`);

      // then
      expect(element).toHaveClass('disabled');
    });

    it('should call ServiceImageComponent with disabled as true', () => {
      // when
      render(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />, {
        wrapper: Wrapper,
      });

      // then
      expect(ServiceImageComponent).toHaveBeenCalledTimes(1);
      expect(ServiceImageComponent).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
        {},
      );
    });

    it('should call ToggleInput with disabled as true', () => {
      // when
      render(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />, {
        wrapper: Wrapper,
      });

      // then
      expect(ToggleInput).toHaveBeenCalledTimes(1);
      expect(ToggleInput).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
        {},
      );
    });

    it('should not call OnChange from react-final-form-listener', () => {
      // when
      render(<ServiceComponent allowToBeUpdated={false} service={serviceMock} />, {
        wrapper: Wrapper,
      });

      // then
      expect(OnChange).not.toHaveBeenCalled();
    });
  });
});
