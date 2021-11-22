import { mocked } from 'ts-jest/utils';

import { removeIdentityProvider } from '../../redux/actions';
import { fireEvent, renderWithRedux } from '../../testUtils';
import IdentityProviderHistoryCard from './index';

jest.mock('../../redux/actions');

// setup
const props = { uid: 'mock-uid' };
const action = { payload: 'mock-uid', type: 'mock-action-type' };
const initialState = {
  identityProviders: [
    {
      active: true,
      display: true,
      name: 'mock-name',
      uid: 'mock-uid',
    },
  ],
  ministries: [
    {
      id: 'mock-ministry-id',
      identityProviders: ['mock-uid'],
      name: 'mock-ministry-name',
    },
  ],
};

describe('IdentityProviderHistoryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('when user click on remove button', () => {
    it('should call redux action removeIdentityProvider', () => {
      // setup
      const { getByText } = renderWithRedux(
        <IdentityProviderHistoryCard {...props} />,
        { initialState },
      );
      const removeButton = getByText('Retirer de cette liste');
      const spy = mocked(removeIdentityProvider, true);
      spy.mockReturnValueOnce(action);
      // action
      fireEvent.click(removeButton);
      // expect
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call redux action removeIdentityProvider with the uid property', () => {
      // setup
      const { getByText } = renderWithRedux(
        <IdentityProviderHistoryCard {...props} />,
        { initialState },
      );
      const removeButton = getByText('Retirer de cette liste');
      const spy = mocked(removeIdentityProvider, true);
      spy.mockReturnValueOnce(action);
      // action
      fireEvent.click(removeButton);
      // expect
      expect(spy).toHaveBeenCalledWith(props.uid);
    });
  });
});
