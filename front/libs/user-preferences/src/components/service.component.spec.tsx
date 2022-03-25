import { render } from '@testing-library/react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { FieldSwitchComponent } from '@fc/backoffice';

import { ServiceComponent } from './service.component';
import { ServiceImageComponent } from './service-image.component';

jest.mock('react-responsive');
jest.mock('react-final-form-listeners');
jest.mock('./service-image.component');

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the container with classes', () => {
    // when
    const { getByTestId } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });
    const element = getByTestId('form-wrapper').firstChild;
    // then
    expect(element).toHaveClass('ServiceComponent');
    expect(element).toHaveClass('flex-start');
    expect(element).toHaveClass('items-start');
  });

  it('should render the container with classname prop', () => {
    // when
    const { getByTestId } = render(
      <ServiceComponent className="any-classname" service={serviceMock} />,
      { wrapper: Wrapper },
    );
    const element = getByTestId('form-wrapper').firstChild;
    // then
    expect(element).toHaveClass('any-classname');
  });

  it('should ServiceImageComponent have been called with service param', () => {
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

  it('should ServiceImageComponent have been called with disabled as true and element should have the disabled class when service is not checked,', () => {
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

  it('should ServiceImageComponent have been called with disabled as false and element should not have the disable class when service is not checked,', () => {
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

  it('should FieldSwitchComponent have been called with default params', () => {
    // when
    render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });
    // then
    expect(FieldSwitchComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        label: expect.any(Function),
        legend: { active: 'Autorisé', inactive: 'Bloqué' },
        name: 'idpList.any-uid',
      }),
      {},
    );
  });

  it('should OnChange from react-final-form-listener have been called with name param', () => {
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

  it('should FieldSwitchComponent have been called with params for a desktop viewport', () => {
    mocked(useMediaQuery).mockReturnValueOnce(true);
    // when
    const { getByTestId } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });
    const element = getByTestId('form-wrapper').firstChild;
    // then
    expect(element).toHaveClass('flex-columns');
    expect(element).not.toHaveClass('flex-rows');
    expect(FieldSwitchComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchComponent).not.toHaveBeenCalledWith(
      expect.objectContaining({ className: 'mt8' }),
      {},
    );
  });

  it('should FieldSwitchComponent have been called with params for a mobile viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { getByTestId } = render(<ServiceComponent service={serviceMock} />, {
      wrapper: Wrapper,
    });
    const element = getByTestId('form-wrapper').firstChild;
    // then
    expect(element).not.toHaveClass('flex-columns');
    expect(element).toHaveClass('flex-rows');
    expect(FieldSwitchComponent).toHaveBeenCalledTimes(1);
    expect(FieldSwitchComponent).toHaveBeenCalledWith(
      expect.objectContaining({ className: 'mt8' }),
      {},
    );
  });
});
