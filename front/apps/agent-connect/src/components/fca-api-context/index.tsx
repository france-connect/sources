/* istanbul ignore file */

/**
 * @TODO #492 unable to mock useState from react
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/492
 */
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadMinistries } from '../../redux/actions';
import { RootState } from '../../types';
import SpinLoader from './spin-loader';

type FCAApiContextProps = {
  children: ReactElement;
};

const FCAApiContextComponent = React.memo(
  ({ children }: FCAApiContextProps): JSX.Element => {
    const dispatch = useDispatch();
    const ministries = useSelector((state: RootState) => state.ministries);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      if (!isMounted) {
        setIsMounted(true);
        const action = loadMinistries();
        dispatch(action);
      }
    }, [isMounted, dispatch]);

    const hasMinistryItems = ministries?.length > 0;
    const shouldShowLoader = !isMounted || !hasMinistryItems;

    return (
      <React.Fragment>
        {shouldShowLoader && <SpinLoader />}
        {!shouldShowLoader && children}
      </React.Fragment>
    );
  },
);

FCAApiContextComponent.displayName = 'FCAApiContextComponent';

export default FCAApiContextComponent;
