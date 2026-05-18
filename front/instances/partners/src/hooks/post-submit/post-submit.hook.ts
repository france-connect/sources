import { useCallback } from 'react';
import { useNavigate } from 'react-router';

// @NOTE DEV : a déplacer et a renommer dans la lib @fc/common
// pour mettre à disposition des autres apps
// Ex : renommer en useNavigateBack
// export const useNavigateBack = (state: RouterSubmitStateInterface) => {
export const usePostSubmit = (message: string, type: string) => {
  const navigate = useNavigate();

  const handler = useCallback(() => {
    const submitState = {
      message,
      type,
    };
    navigate('..', { replace: true, state: { submitState } });

    return Promise.resolve(undefined);
  }, [navigate, message, type]);

  return handler;
};
