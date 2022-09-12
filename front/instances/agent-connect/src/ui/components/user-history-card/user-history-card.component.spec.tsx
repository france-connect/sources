import { render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { UserHistoryCardComponent } from './user-history-card.component';
import { UserHistoryCardContentComponent } from './user-history-card-content.component';
import { UserHistoryCardRemoveButtonComponent } from './user-history-card-remove-button.component';

jest.mock('./user-history-card-content.component');
jest.mock('./user-history-card-remove-button.component');

describe('UserHistoryCardComponent', () => {
  const identityProviderMock = {
    active: false,
    display: true,
    name: 'mock-name-1',
    uid: 'mokc-uid-1',
  };

  it('should have the class user-history-card', () => {
    // when
    const { container } = render(<UserHistoryCardComponent item={identityProviderMock} />);

    // then
    expect(container.firstChild).toHaveClass('user-history-card');
  });

  it('should have called UserHistoryCardRemoveButtonComponent', () => {
    // given
    mocked(UserHistoryCardRemoveButtonComponent).mockClear();

    // when
    render(<UserHistoryCardComponent item={identityProviderMock} />);

    // then
    expect(UserHistoryCardRemoveButtonComponent).toHaveBeenCalledTimes(1);
    expect(UserHistoryCardRemoveButtonComponent).toHaveBeenCalledWith(
      { uid: identityProviderMock.uid },
      {},
    );
  });

  it('should have called UserHistoryCardContentComponent', () => {
    // given
    mocked(UserHistoryCardContentComponent).mockClear();

    // when
    render(<UserHistoryCardComponent item={identityProviderMock} />);

    // then
    expect(UserHistoryCardContentComponent).toHaveBeenCalledTimes(1);
    expect(UserHistoryCardContentComponent).toHaveBeenCalledWith(
      expect.objectContaining({ identityProvider: identityProviderMock }),
      {},
    );
  });
});
