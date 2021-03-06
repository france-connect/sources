import { render } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';
import { mocked } from 'ts-jest/utils';

import { useUserHistory } from '@fc/agent-connect-history';

import { UserHistoryCardComponent } from '../user-history-card/user-history-card.component';
import { UserHistoryComponent } from './user-history.component';

jest.mock('../user-history-card/user-history-card.component');

describe('UserHistoryComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title of the section', () => {
    // when
    const { getByTestId } = render(<UserHistoryComponent />);
    const element = getByTestId('title');
    // expect
    expect(element).toBeInTheDocument();
    expect(element.innerHTML).toStrictEqual('J’utilise à nouveau');
  });

  it('should not render the title of the section', () => {
    // given
    mocked(useUserHistory).mockReturnValueOnce([]);
    // when
    const { getByTestId } = render(<UserHistoryComponent />);
    expect(() => {
      getByTestId('title');
    }).toThrow();
  });

  it('should have called useUserHistory hook', () => {
    // when
    render(<UserHistoryComponent />);
    // expect
    expect(useUserHistory).toHaveBeenCalled();
  });

  it('should render a list of history card (4)', () => {
    // given
    mocked(UserHistoryCardComponent).mockClear();
    // when
    render(<UserHistoryComponent />);
    // expect
    expect(UserHistoryCardComponent).toHaveBeenCalledTimes(4);
  });

  it('should have called useMediaQuery hook', () => {
    // when
    render(<UserHistoryComponent />);
    // expect
    expect(useMediaQuery).toHaveBeenCalledWith({ query: '(min-width: 768px)' });
  });

  it('should match the snapshot for a desktop viewport', () => {
    // when
    const { container } = render(<UserHistoryComponent />);
    // then
    expect(container).toMatchSnapshot();
  });

  it('should match the snapshot for a tablet viewport', () => {
    // given
    mocked(useMediaQuery).mockReturnValueOnce(false);
    // when
    const { container } = render(<UserHistoryComponent />);
    // then
    expect(container).toMatchSnapshot();
  });
});
