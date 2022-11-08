import { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AccountContext, AccountInterface } from '@fc/account';
import { InitialState } from '@fc/state-management';

import { transformServiceProvider } from '../services';

interface useServiceProviderDetailsProps {
  type: string;
  id: string;
}

export const useServiceProviderDetails = ({ id, type }: useServiceProviderDetailsProps) => {
  const initialized = useRef(false);
  const dispatch = useDispatch();

  // @TODO: create a generic hook for user's connection https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/848#note_168741
  const { connected, ready } = useContext<AccountInterface>(AccountContext);
  // @NOTE function is simple enough to be tested through its parent
  /* istanbul ignore next */
  const { item } = useSelector((state: InitialState) => state.ServiceProviderItem);

  const itemTransformed = ready && connected && item ? transformServiceProvider(item) : undefined;

  useEffect(() => {
    const shouldFetchData = !initialized.current && ready && connected;

    if (shouldFetchData) {
      initialized.current = true;
      const action = { payload: { id }, type };
      dispatch(action);
    }
  }, [ready, connected, id, type, dispatch]);

  return {
    item: itemTransformed,
  };
};
