import { render } from '@testing-library/react';

import { ConfigService } from '@fc/config';

import { RedirectToIdpFormComponent } from './redirect-to-idp-form.component';

jest.mock('@fc/config', () => ({
  ConfigService: {
    get: jest.fn(() => ({ endpoints: { redirectToIdp: 'mock-redirectToIdp' } })),
  },
}));

describe('RedirectToIdpFormComponent', () => {
  it('should the content as children', () => {
    // given
    const { getByText } = render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // when
    const element = getByText('mock-component-content');

    // then
    expect(element).toBeInTheDocument();
  });

  it('should render a a form with the id props', () => {
    // given
    const { getByTestId } = render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // when
    const element = getByTestId('csrf-form');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('id', 'mock-id');
  });

  it('should call ConfigService.get with oidcclient config name', () => {
    // when
    render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // then
    expect(ConfigService.get).toHaveBeenCalledWith('OidcClient');
  });

  it('should render a a form with the action attribute equal to the context value', () => {
    // given
    const { getByTestId } = render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // when
    const element = getByTestId('csrf-form');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('action', 'mock-redirectToIdp');
  });

  it('should render a hidden input with crsf value', () => {
    // given
    const { getByTestId } = render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // when
    const element = getByTestId('csrf-input');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('value', 'mock-csrf');
  });

  it('should render a hidden input with uid value', () => {
    // given
    const { getByTestId } = render(
      <RedirectToIdpFormComponent csrf="mock-csrf" id="mock-id" uid="mock-uid">
        <div>mock-component-content</div>
      </RedirectToIdpFormComponent>,
    );

    // when
    const element = getByTestId('uid-input');

    // then
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('value', 'mock-uid');
  });
});
