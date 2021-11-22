import './styles.scss';

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { removeIdentityProvider } from '../../redux/actions';

type RemoveButtonProps = {
  uid: string;
};

const RemoveButtonComponent = React.memo(
  ({ uid }: RemoveButtonProps): JSX.Element => {
    const dispatch = useDispatch();

    const onClickRemoveButton = useCallback(() => {
      const action = removeIdentityProvider(uid);
      dispatch(action);
    }, [dispatch, uid]);

    return (
      <button className="m16" type="button" onClick={onClickRemoveButton}>
        Retirer de cette liste
      </button>
    );
  },
);

RemoveButtonComponent.displayName = 'RemoveButtonComponent';

export default RemoveButtonComponent;
