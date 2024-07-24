## Exemples de Tests

**Boucher une function exportée d'un fichier**

```
import { removeIdentityProvider } from '../../../<ma_lib>/actions';
...
jest.mock('../../../<ma_lib>/actions');
...
const spy = jest.mocked(removeIdentityProvider, true);
spy.mockReturnValueOnce(action);
```

**Faire un test d'un hook custom**

```
import { renderHook } from '@testing-library/react';

const Wrapper = () => (<MonContext.Provider value={{...}} />)

...
const { result } = renderHook(() => useMonHookCustom(), { wrapper: Wrapper })
```
