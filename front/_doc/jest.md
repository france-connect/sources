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

**Faire un test avec un context et un provider**

```
// Given
export const StepperContext = React.createContext({
  currentStep: 0,
  gotoNextStep: () => {},
});

const StepperContextProviderConsumerMock = () => {
  const context = use(StepperContext);
  return (
    <button data-testid="StepperContext.Consumer.button" onClick={context?.gotoNextStep}>
      Next Step
    </button>
  );
};

const ProviderMock = () => (
  <StepperContextProvider config={configMock}>
    <StepperContextProviderConsumerMock />
  </StepperContextProvider>
);

// When
const { getByTestId } = render(
  <StepperContextProvider config={configMock}>
    <StepperContextProviderConsumerMock />
  </StepperContextProvider>,
);
const buttonElt = getByTestId('StepperContext.Consumer.button');
fireEvent.click(buttonElt);

// Then
expect(navigateMock).toHaveBeenCalledOnce();
expect(navigateMock).toHaveBeenCalledWith(pathMock);
```
