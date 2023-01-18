import { fireEvent, render } from '@testing-library/react';

import { useAddToUserHistory } from '@fc/agent-connect-history';
import { RedirectToIdpFormComponent } from '@fc/oidc-client';

import { SearchResultComponent } from './search-result.component';

describe('SearchResultComponent', () => {
  it('should have called useAddToUserHistory with uid props', () => {
    // when
    render(<SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />);

    // then
    expect(useAddToUserHistory).toHaveBeenCalledTimes(1);
    expect(useAddToUserHistory).toHaveBeenCalledWith('uid-mock');
  });

  it('should have a submit button', () => {
    // when
    const { getByRole } = render(
      <SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />,
    );
    const button = getByRole('button');

    // then
    expect(button).toBeInTheDocument();
  });

  it('should have called addToUserHistory on button click', () => {
    // given
    const addToUserHistoryMock = jest.fn();
    jest.mocked(useAddToUserHistory).mockImplementation(() => addToUserHistoryMock);

    // when
    const { getByRole } = render(
      <SearchResultComponent csrfToken="csrf-token-mock" name="name-mock" uid="uid-mock" />,
    );
    const button = getByRole('button');
    fireEvent.click(button);

    // then
    expect(button).toBeInTheDocument();
    expect(addToUserHistoryMock).toHaveBeenCalledTimes(1);
  });

  it('should have called RedirectToIdpFormComponent with props', () => {
    // given
    const uidMock = 'uid-mock';
    const nameMock = 'name-mock';
    const csrfTokenMock = 'csrf-token-mock';
    jest.mocked(RedirectToIdpFormComponent).mockReturnValueOnce(<div />);

    // when
    render(<SearchResultComponent csrfToken={csrfTokenMock} name={nameMock} uid={uidMock} />);

    // then
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
