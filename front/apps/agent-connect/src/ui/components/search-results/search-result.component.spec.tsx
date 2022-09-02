import { fireEvent, render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { useAddToUserHistory } from '@fc/agent-connect-history';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { SearchResultComponent } from './search-result.component';

describe('SearchResultComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have called useAddToUserHistory with uid props', () => {
    // then
    render(<SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />);
    // when
    expect(useAddToUserHistory).toHaveBeenCalledTimes(1);
    expect(useAddToUserHistory).toHaveBeenCalledWith('uid-mock');
  });

  it('should have a submit button', () => {
    // then
    const { getByRole } = render(
      <SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />,
    );
    const button = getByRole('button');
    // when
    expect(button).toBeInTheDocument();
  });

  it('should have called addToUserHistory on button click', () => {
    // given
    const addToUserHistoryMock = jest.fn();
    mocked(useAddToUserHistory).mockImplementation(() => addToUserHistoryMock);
    // then
    const { getByRole } = render(
      <SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    // when
    expect(button).toBeInTheDocument();
    expect(addToUserHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('should have called RedirectToIdpFormComponent with props', () => {
    // given
    const uidMock = 'uid-mock';
    const nameMock = 'name-mock';
    const csrfTokenMock = 'csrf-token-mock';
    mocked(RedirectToIdpFormComponent).mockReturnValueOnce(<div />);
    // then
    render(<SearchResultComponent csrfToken={csrfTokenMock} name={nameMock} uid={uidMock} />);
    // when
    expect(RedirectToIdpFormComponent).toHaveBeenCalledTimes(1);
    expect(RedirectToIdpFormComponent).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        csrf: csrfTokenMock,
        id: `fca-search-idp-${uidMock}`,
        uid: uidMock,
      },
      {},
    );
  });
});
