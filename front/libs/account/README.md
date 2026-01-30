# @fc/account

React library providing a context to manage authentication state and user information.

> ⚠️ **Important**:  
> **All session expiration exceptions (code 401) are automatically handled by the AccountProvider.**
> If the user attempts to access a protected page wrapped in the [`AuthedRoute`](https://github.com/france-connect/front/blob/main/libs/routing/src/components/authed-route/authed.route.tsx) component provided by the [`@fc/routing`](https://github.com/france-connect/front/blob/main/libs/routing/README.md) library, they will be automatically redirected to the configured fallback route.

For more details, please refer to:

- [AuthedRoute](../routing/src/components/authed-route/authed.route.tsx)
- [@fc/routing Documentation](../routing/README.md)

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [User Data Validation](#user-data-validation)
- [API](#api)
- [Types and Interfaces](#types-and-interfaces)

## 🚀 Installation

This library is part of the FranceConnect monorepo. It is available via the `@fc/account` alias.

```typescript
import { AccountProvider, AccountContext } from '@fc/account';
```

## ⚙️ Configuration

The library requires configuration via `@fc/config` with the `Account` key.

### Configuration Interface

```typescript
interface AccountConfig {
  endpoints: {
    login: string;
    me: string;
    logout: string;
  };
}
```

### Configuration Example

```typescript
import { ConfigService } from '@fc/config';
import { AccountOptions } from '@fc/account';

ConfigService.set('Account', {
  endpoints: {
    login: '/api/auth/login',
    me: '/api/user/me',
    logout: '/api/auth/logout',
  },
});
```

## 📖 Basic Usage

### 1. Wrap your application with the Provider

```tsx
import { AccountProvider } from '@fc/account';
import { ConnectValidator } from '@fc/account';

function App() {
  return (
    <AccountProvider validator={ConnectValidator}>
      <YourAppContent />
    </AccountProvider>
  );
}
```

### 2. Use the context in your components

#### With the `useContext` hook

```tsx
import { useContext } from 'react';
import { AccountContext } from '@fc/account';
import { useSafeContext } from '@fc/common';

function UserProfile() {
  const account = useSafeContext(AccountContext);

  if (!account.ready) {
    return <div>Loading...</div>;
  }

  if (!account.connected) {
    return <div>Not connected</div>;
  }

  if (account.expired) {
    return <div>Session expired</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>First Name: {account.userinfos?.firstname}</p>
      <p>Last Name: {account.userinfos?.lastname}</p>
      <p>Email: {account.userinfos?.email}</p>
    </div>
  );
}
```

## ✅ User Data Validation

The library provides a default validator: `ConnectValidator`.

### Default Validator

```typescript
import { ConnectValidator } from '@fc/account';

// Validates that firstname and lastname are present
<AccountProvider validator={ConnectValidator}>
  <App />
</AccountProvider>
```

### Creating a Custom Validator

You can create a custom validator by implementing the `UserInfosValidatorInterface` interface:

```typescript
import type { UserInfosValidatorInterface, UserInfosInterface } from '@fc/account';

class StrictValidator implements UserInfosValidatorInterface {
  validate(userInfos: UserInfosInterface): boolean {
    return !!(
      userInfos.firstname?.trim() &&
      userInfos.lastname?.trim() &&
      userInfos.email?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfos.email)
    );
  }
}
```

## 🔌 API

### `AccountProvider`

React Provider that initializes the context and retrieves user information.

#### Props

```typescript
interface AccountProviderProps {
  children: React.ReactNode;
  validator: UserInfosValidatorInterface;
}
```

#### Behavior

- Automatically retrieves user information when the component mounts
- Manages connection status, session expiration, and loading state
- Only renders children when `ready` is `true`
- Automatically detects session expiration via `@fc/axios-error-catcher`

### `AccountContext`

React Context exposing the authentication state.

#### Context State

```typescript
interface AccountContextState {
  connected: boolean; // Indicates if the user is connected
  ready: boolean; // Indicates if data is ready
  expired: boolean; // Indicates if the session has expired
  userinfos: UserInfosInterface | undefined; // User information
}
```

## 📝 Types and Interfaces

### `AccountContextState<U>`

Authentication context state.

```typescript
interface AccountContextState<U extends UserInfosInterface = UserInfosInterface> {
  connected: boolean;
  ready: boolean;
  expired: boolean;
  userinfos: U | undefined;
}
```

### `UserInfosInterface`

Base interface for user information.

```typescript
interface UserInfosInterface {
  firstname: string;
  lastname: string;
  email: string;
}
```

### `UserInfosValidatorInterface`

Interface for user data validators.

```typescript
interface UserInfosValidatorInterface {
  validate: (userInfos: UserInfosInterface) => boolean;
}
```

### `AccountConfig`

Library configuration.

```typescript
interface AccountConfig {
  endpoints: {
    login: string;
    me: string;
    logout: string;
  };
}
```

## 📦 Dependencies

This library depends on:

- `@fc/axios-error-catcher`: For HTTP error handling
- `@fc/common`: For `useSafeContext`
- `@fc/config`: For configuration
- `@fc/http-client`: For HTTP calls

## 📚 See Also

- [Configuration Interface](./src/interfaces/account-config.interface.ts)
- [Context State Interface](./src/interfaces/account-context.state.interface.ts)
- [Validation Interface](./src/interfaces/user-infos-validator.interface.ts)
- [User Info Retrieval Service](./src/services/user-infos/user-infos.service.ts)
