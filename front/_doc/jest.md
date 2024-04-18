## Exemples de Tests

**Boucher une function exportée d'un fichier**

```
import { removeIdentityProvider } from '../../../redux/actions';
...
jest.mock('../../../redux/actions');
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
