/* istanbul ignore file */

// declarative file
import { ActionCreator, UnknownAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type ThunkActionType = ActionCreator<
  ThunkAction<Promise<unknown>, unknown, null, UnknownAction>
>;

export type ThunkDispatchType = ThunkDispatch<unknown, null, UnknownAction>;
