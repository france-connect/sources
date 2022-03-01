/* istanbul ignore file */

/**
 * @TODO #492 unable to mock useState from react
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/492
 */
import axios from 'axios';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ERROR_PATH } from '@fc/routing';

import { ACTION_TYPES, API_DATAS_ROUTES } from '../../constants';
import { RootState, Ministry } from '../../types';

import { SpinLoaderComponent } from './spin-loader';

type FCAApiContextProps = {
  children: ReactElement;
};

export const FCAApiContextComponent = React.memo(
  ({ children }: FCAApiContextProps): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    const ministries = useSelector((state: RootState) => state.ministries);
    const [isMounted, setIsMounted] = useState(false);

    async function loadMinistries() {
      dispatch({ type: ACTION_TYPES.MINISTRY_LIST_LOAD_START });
      try {
        const { data } = await axios.get<Ministry[]>(API_DATAS_ROUTES);
        dispatch({
          payload: data,
          type: ACTION_TYPES.MINISTRY_LIST_LOAD_COMPLETED,
        });
      } catch (err) {
        history.replace(ERROR_PATH, { replace: true });
      }
    }

    useEffect(() => {
      if (!isMounted) {
        setIsMounted(true);
        loadMinistries();
      }
    }, [isMounted, dispatch]);

    const hasMinistryItems = ministries?.length > 0;
    const shouldShowLoader = !isMounted || !hasMinistryItems;

    return (
      <React.Fragment>
        {shouldShowLoader && <SpinLoaderComponent />}
        {!shouldShowLoader && children}
      </React.Fragment>
    );
  },
);

FCAApiContextComponent.displayName = 'FCAApiContextComponent';
