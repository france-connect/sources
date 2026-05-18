import { render } from '@testing-library/react';
import { useDocumentTitle } from 'usehooks-ts';

import { type AccountContextState, useAccountContext } from '@fc/account';
import { SessionExpiredAlertComponent } from '@fc/core-user-dashboard';
import { Sizes } from '@fc/dsfr';

import { LoginLayout } from './login.layout';

describe('LoginLayout', () => {
  // Given
  const childrenMock = <div>Children Mock</div>;
  const documentTitleMock = 'any-acme-document-title';
  const accountContextState = {
    connected: true,
    expired: false,
    ready: true,
    userinfos: undefined,
  } as AccountContextState;

  beforeEach(() => {
    // Given
    jest.mocked(useAccountContext).mockReturnValue(accountContextState);
  });

  it('should match the snapshot, when size is small', () => {
    // When
    const { container } = render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.SMALL}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when size is medium', () => {
    // When
    const { container } = render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when session has not expired', () => {
    // When
    const { container } = render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot, when session has expired', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({ ...accountContextState, expired: true });

    // When
    const { container } = render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(container).toMatchSnapshot();
  });

  it('should render SessionExpiredAlertComponent, when session has expired', () => {
    // Given
    jest.mocked(useAccountContext).mockReturnValueOnce({ ...accountContextState, expired: true });

    // When
    render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(SessionExpiredAlertComponent).toHaveBeenCalledExactlyOnceWith({});
  });

  it('should not render SessionExpiredAlertComponent, when session has  not expired', () => {
    // When
    render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(SessionExpiredAlertComponent).not.toHaveBeenCalled();
  });

  it('should render children', () => {
    // When
    const { getByText } = render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(getByText('Children Mock')).toBeInTheDocument();
  });

  it('should set document title', () => {
    // When
    render(
      <LoginLayout documentTitle={documentTitleMock} size={Sizes.MEDIUM}>
        {childrenMock}
      </LoginLayout>,
    );

    // Then
    expect(useDocumentTitle).toHaveBeenCalledExactlyOnceWith(documentTitleMock);
  });
});
