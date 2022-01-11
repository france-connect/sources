/* istanbul ignore file */

// declarative file
import { ActionCreator, AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type ThunkActionType = ActionCreator<
  ThunkAction<Promise<unknown>, unknown, null, AnyAction>
>;

export type ThunkDispatchType = ThunkDispatch<unknown, null, AnyAction>;
