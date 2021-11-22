## Exemples de Tests

**Boucher une function exportée d'un fichier**

```
import { mocked } from 'ts-jest/utils';
import { removeIdentityProvider } from '../../../redux/actions';
...
jest.mock('../../../redux/actions');
...
const spy = mocked(removeIdentityProvider, true);
spy.mockReturnValueOnce(action);
```

**Faire un test d'un composant qui utilise Redux**

```
import { renderWithRedux } from '../../testUtils';
...
const { getByText } = renderWithRedux(
  <IdentityProviderCard {...props} />,
  { initialState },
)
```

## JSDom Form + Testing Library

JSdom ne gère pas l'envoi de formulaire, une exception sera levée

```
Error: Not implemented: HTMLFormElement.prototype.submit
```

https://github.com/jsdom/jsdom/issues/1937#issuecomment-526162324
