import { fireEvent, render } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { useRemoveFromUserHistory } from '@fc/agent-connect-history';

import { UserHistoryCardRemoveButtonComponent } from './user-history-card-remove-button.component';

jest.mock('@fc/agent-connect-history');

describe('UserHistoryCardRemoveButtonComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display a specific label', () => {
    // given
    const uid = 'mock-uid';
    // when
    const { getByText } = render(<UserHistoryCardRemoveButtonComponent uid={uid} />);
    const element = getByText('Supprimer de cette liste');
    // then
    expect(element).toBeInTheDocument();
  });

  it('should call useRemoveFromUserHistory at first render', () => {
    // given
    const uid = 'mock-uid';
    // when
    render(<UserHistoryCardRemoveButtonComponent uid={uid} />);
    // then
    expect(useRemoveFromUserHistory).toHaveBeenCalledTimes(1);
    expect(useRemoveFromUserHistory).toHaveBeenCalledWith(uid);
  });

  it('should have called removeFromUserHistory at user button click', () => {
    // given
    const uid = 'mock-uid';
    const removeFromUserHistoryMock = jest.fn();
    mocked(useRemoveFromUserHistory).mockReturnValue(removeFromUserHistoryMock);
    // when
    const { getByTestId } = render(<UserHistoryCardRemoveButtonComponent uid={uid} />);
    const button = getByTestId('remove-button');
    fireEvent.click(button);
    // then
    expect(removeFromUserHistoryMock).toHaveBeenCalledTimes(1);
  });
});
