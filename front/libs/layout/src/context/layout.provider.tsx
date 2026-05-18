import { type PropsWithChildren } from 'react';
import { useToggle } from 'usehooks-ts';

import { useAccountContext } from '@fc/account';

import { LayoutContext } from './layout.context';

export const LayoutProvider = ({ children }: PropsWithChildren) => {
  const [menuIsOpened, toggleMenu] = useToggle(false);

  const { connected, ready, userinfos } = useAccountContext();
  const isUserConnected = connected && ready;

  return (
    <LayoutContext.Provider
      value={{
        isUserConnected,
        menuIsOpened,
        toggleMenu,
        userinfos,
      }}>
      {children}
    </LayoutContext.Provider>
  );
};
