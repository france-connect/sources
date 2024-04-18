/* istanbul ignore file */

// declarative file
import type { ActionCreator, UnknownAction } from 'redux';
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type ThunkActionType = ActionCreator<
  ThunkAction<Promise<unknown>, unknown, null, UnknownAction>
>;

export type ThunkDispatchType = ThunkDispatch<unknown, null, UnknownAction>;
