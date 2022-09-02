# axios-error-catcher

Provides a react context to manage error request/response interceptors to axios.

## Context example

```
  <AxiosErrorCatcherProvider>
    <AxiosErrorCatcherContext.Consumer>
      {({ hasError, errorCode }) => (
        <div>...</div>
      )}
    </AxiosErrorCatcherContext.Consumer>
  </AxiosErrorCatcherProvider>
```
