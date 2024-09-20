# Account

Provides a react context to fetch a user account.

## Context example

```
  <AccountProvider>
    <AccountContext.Consumer>
      {({ connected, userinfos }) => (
        <div>...</div>
      )}
  </AccountContext.Consumer>
  </AccountProvider>
```

## Config

See [interface file](./src/interfaces/account-config.interface.ts) for an up to date view on configuration:
