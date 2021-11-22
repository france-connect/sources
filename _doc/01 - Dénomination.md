# Dénomination

Vous trouverez sur [ce lien](<https://en.wikipedia.org/wiki/Naming_convention_(programming)#Examples_of_multiple-word_identifier_formats>) la liste des différents format évoqués ici.

### Les `types`, `classes`, `interfaces` et `enums`

Les `types`, `classes`, `interfaces` et `enums` s'écrivent en `PascalCase`.

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
 * 😱 Pas cool 😱
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

### Les `constantes globales`, les `propritétés des enums` et `variables d'environnement`

Les `constantes globales`, les `propritétés des enums` et `variables d'environnement` s'écrivent en `SCREAMING_SNAKE_CASE`.

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
 * 😱 Pas cool 😱
 */

const routes_prefix = /* ... */;

process.env.tlspubcert = /* ... */;

enum DevelopersTypes {
  frontEnd = /* ... */;
  BackEnd = /* ... */;
}
```

### Les `variables`, `propriétés`, `noms de fonction` et `paramètres de fonction`

Les `variables`, `propriétés`, `noms de fonction` et `paramètres de fonction` s'écrivent en `camelCase`.

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
 * 😱 Pas cool 😱
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

### Les `noms de fichier` ainsi que les `noms de dossier`

Les `noms de fichier` ainsi que les `noms de dossier` s'écrivent en `lisp-case` suivit de leur `extension`.

- 🚩 Les noms de fichier peuvent contenir un `"."` pour définir ce qu'il contient ou s'il doit être caché.
- 🚩 Les noms de dossier peuvent exceptionellement être préfixés par `"_"` s'il est **absolument** nécessaire qu'ils apparaissent en premier.

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
# 😱 Pas cool 😱 #
##################

user_update.service.ts

user-update.service

Gitlab-ci.yml

user\ fixtures/

_Doc/

```

### Les caractères ne faisant pas partie de la table standard ASCII

Les caractères ne faisant pas partie de la [table standard ASCII](https://fr.wikipedia.org/wiki/American_Standard_Code_for_Information_Interchange#Table_des_128_caract%C3%A8res_ASCII) sont proscrits.

```typescript
/**
 * 😍 Cool 😍
 */

const userLastConnection = /* ... */;
```

```typescript
/**
 * 😱 Pas cool 😱
 */

const ウセル_ラスト_コネチウン = /* ... */;
```

```bash
##############
# 😍 Cool 😍 #
##############

./services/user-update.service.ts
```

```bash
##################
# 😱 Pas cool 😱 #
##################

./ダタバイズ/ラスト-コネチウン/ウセル.db
```

### La nomenclature

Les noms choisis doivent être `clairs`, `synthétiques` et `refléter le sens` au premier coup d'oeil. Ils sont rédigés en anglais.

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
 * 😱 Pas cool 😱
 */

const u = /* ... */;

class Service {
  // ...
}

interface UserButWithoutThatProperty {
  // ...
}

let omeletteDuFromage = /* ... */;
```

### Les `abréviations`

Les `abréviations` sont tolérées lorsqu'elles valident le point précédent.

```typescript
/**
 * 😍 Cool 😍
 */

const oidcCallback = /* ... */; // =### openIdConnectCallback

const TLS_PRIV_KEY = /* ... */;
```

```typescript
/**
 * 😱 Pas cool 😱
 */

let odf = /* ... */; // =### omeletteDuFromage 🙈

class UsrServ {
  // ...
}
```
