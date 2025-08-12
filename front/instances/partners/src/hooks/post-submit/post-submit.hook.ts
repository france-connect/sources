import { useCallback } from 'react';
import { useNavigate } from 'react-router';

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
