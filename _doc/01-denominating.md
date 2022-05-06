# Denomination

## Foreword

You can find on [this link](<https://en.wikipedia.org/wiki/Naming_convention_(programming)#Examples_of_multiple-word_identifier_formats>) the exhaustive list of the notations used here.

## Rules

### `types`, `classes`, `interfaces` and `enums`

The `types`, `classes`, `interfaces` and `enums` MUST respect the `PascalCase` notation.

```typescript
/**
 * 😍 Cool 😍
 */

type PermissionLevel = /* ... */;

class ConnectionModule {
  // ...
}

interface UserRole {
  // ...
}

enum OidcRoutes {
  // ...
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

type _PermissionLevel = /* ... */;

class connectionModule {
  // ...
}

interface user_role {
  // ...
}

enum OIDCRoutes {
  // ...
}
```

### `global constants`, `enum properties` and `environment variables`

The `global constants`, `enum properties` and `environment variables` MUST respect the `SCREAMING_SNAKE_CASE` notation.

```typescript
/**
 * 😍 Cool 😍
 */

const ROUTES_PREFIX = /* ... */;

process.env.TLS_PRIV_KEY = /* ... */;

enum DevelopersTypes {
  FRONT_END = /* ... */;
  BACK_END = /* ... */;
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

const routes_prefix = /* ... */;

process.env.tlspubcert = /* ... */;

enum DevelopersTypes {
  frontEnd = /* ... */;
  BackEnd = /* ... */;
}
```

### `variables`, `properties`, `functions name` and `functions parameters`

The `variables`, `properties`, `functions name` and `functions parameters` MUST respect the `camelCase` notation.

```typescript
/**
 * 😍 Cool 😍
 */

const userLastConnection = /* ... */;

let pseudo = /* ... */;

function doABarrelRoll(direction: BarrelDirection): boolean {
  // ...
}

const user = {
  pseudo: /* ... */,
  lastConnection: /* ... */,
  createdAt: /* ... */,
}
```

```typescript
/**
 * 😱 Not cool 😱
 */

const user_last_connection = /* ... */;

let Pseudo = /* ... */;

function Do_A_Barrel_Roll(direCtion: BarrelDirection): boolean {
  // ...
}

const user = {
  _pseudo: /* ... */,
  last_Connection: /* ... */,
  'created-at': /* ... */,
}
```

### `files name` and `directories name`

The `files name` and `directories name` MUST respect the `lisp-case` notation, followed by their `extension`.

- 🚩 Files name CAN contain one or more `"."` to help identifying the file type aside the extension (services, components, etc... See [11 - Files and directories architecture]<./11-files-and-directories-architecture.md> for more details).
- 🚩 Directories name CAN be prefixed by a single `"_"` if they MUST appear first.

```bash
##############
# 😍 Cool 😍 #
##############

user-update.service.ts

.gitlab-ci.yml

user-fixtures/

_doc/

```

```bash
##################
# 😱 Not cool 😱 #
##################

user_update.service.ts

user-update.service

Gitlab-ci.yml

user\ fixtures/

_Doc/

```

### Characters set

Characters used MUST be within [standard ASCII table](https://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange#Table_des_128_caract%C3%A8res_ASCII) with the exception of commentaries (see [9 - Commentaries]<./9-commentaries.md> for more).

```typescript
/**
 * 😍 Cool 😍
 */

const userLastConnection = /* ... */;
```

```typescript
/**
 * 😱 Not cool 😱
 */

const ウセル_ラスト_コネチウン = /* ... */;
```

```typescript
/**
 * 😍 Cool 😍
 */

/**
 * 💡 This is a perfectly 🍷 valid commentary 😉
 */
```


```bash
##############
# 😍 Cool 😍 #
##############

./services/user-update.service.ts
```

```bash
##################
# 😱 Not cool 😱 #
##################

./ダタバイズ/ラスト-コネチウン/ウセル.db
```

### Nomenclature

Names MUST remain `intelligible`, `explicit`, `mnemonic` and `reflect their usage` at first glance. They MUST be written in English.

```typescript
/**
 * 😍 Cool 😍
 */

const username = /* ... */;

class UserService {
  // ...
}

interface DatabaseConfig {
  // ...
}

let i = 0;
```

```typescript
/**
 * 😱 Not cool 😱
 */

const u = /* ... */;

const username = 42;

class Service {
  // ...
}

interface UserButWithoutThatProperty {
  // ...
}

let omeletteDuFromage = /* ... */;
```

### `Abreviations`

`Abreviations` are tolerated and MUST respect the nomenclature rules described in the previous section.

```typescript
/**
 * 😍 Cool 😍
 */

const oidcCallback = /* ... */; // =### openIdConnectCallback

const TLS_PRIV_KEY = /* ... */;
```

```typescript
/**
 * 😱 Not cool 😱
 */

let odf = /* ... */; // =### omeletteDuFromage 🙈

class UsrServ {
  // ...
}
```
