
# Files and directories architecture

## Foreword

To ease navigation in the repository, and in complement of the [denominating documentation](<./01-denominating.md>), the nomenclature respect a number of rules that applies globally. Each first-level directory can enact more rules (to help responding the specificities of used technologies). They SHOULD NOT interfere with the following.

## Global structure

The repository is currently divided in several mains directories:

```bash
./_doc # <-- You are here
./back
./front
./docker
./quality
```

### _doc (you are here)

This directory centralize the technical documentation that define coding rules applicable to this repository.

### back

This MUST contains all the applications that are executed server side. See [here for more information (not implemented yet)](<>).

### front

This MUST contains all the applications that are executed client side. See [here for more information (not implemented yet)](<>).

### docker

If you want to execute a local stack, you can find everything you need here. See the [documentation here](<./docker/_doc/README.md>).

### quality

As we promote QA, you can find here [BDD](<https://en.wikipedia.org/wiki/Behavior-driven_development>) tests. See the [documentation here](./quality/_doc/README.md).

## Main rules

### Documentation

Every first-level directory MUST have a `_doc` directory containing at least a `README.md` file. This file SHOULD be linked in the present document to ensure a global entry point.

All files MUST respect the markdown notation.

If an order SHOULD be respected in the documentation, the files MUST begin with a number that respect ascii sorting.


```bash
##
# 😍 Cool 😍
##

./01-first-file.md
./02-second-file.md
./11-nth-file.md

```

```bash
##
# 😱 Not cool 😱
##

./1-first-file.md
./11-nth-file.md
./2-second-file.md
```

### Code structure

The user SHOULD be able to identify at first glance the role of the directory / file he is looking. Therefor, here is a list of names that are commons to all type of code products. It SHOULD be used when applicable.

- 🚩 Directories names MUST be plural as they can contain multiple files of the same type.
- 🚩 Each directory MUST have a barrel in form of a `index.<extension>` file that export the files in the directory (Ex. `index.ts`). 
- 🚩 Files names MUST be suffixed by the type they belong as `<file-name>.<type>.<extension>` (Ex. `sign-in.service.ts`).
- 🚩 Test files names MUST add a ".spec" to the file name as `<file-name>.<type>.spec.<extension>` (Ex. `sign-in.service.spec.ts`).

#### services

A service is a group of functions that are linked to the processing of a business or technical unit.

```bash
##
# 😍 Cool 😍
##

# Business
./services/sign-in.service.ts
./services/sign-in.service.spec.ts

# Technical
./services/cryptography.service.ts
./services/cryptography.service.spec.ts
```

```bash
##
# 😱 Not cool 😱
##

./services/sign-in.ts

./services/sign-in-test.ts

./services/input.controller.ts

./services/service.ts
```

#### controllers

A controller is an entry point of the application. It received user / machine inputs and dispatch the processing units.

```bash
##
# 😍 Cool 😍
##

# Business
./controllers/identity-providers.controller.ts
./controllers/identity-providers.controller.spec.ts

# Technical
./controllers/oidc-client.controller.ts
./controllers/oidc-client.controller.spec.ts
```

```bash
##
# 😱 Not cool 😱
##

./controllers/identity-providers.ts

./controllers/identity-providers-test.ts

./controllers/oidc-client.service.ts

./controllers/controller.ts
```

#### interfaces

An interface is a programming structure / syntax used to enforce certain properties on an object / class.

```bash
##
# 😍 Cool 😍
##

./interfaces/http-response.interface.ts

./interfaces/connector-options.interface.ts
```

```bash
##
# 😱 Not cool 😱
##

./interfaces/http-response.ts

./interfaces/http-response-test.ts

./interfaces/connector-options.service.ts

./interfaces/interface.ts
```

#### DTO

A DTO is an object that carries data between processes.

```bash
##
# 😍 Cool 😍
##

./dto/http-response.dto.ts

./dto/connector-options.dto.ts
```

```bash
##
# 😱 Not cool 😱
##

./dto/http-response.ts

./dto/http-response-test.ts

./dto/connector-options.service.ts

./dto/dto.ts
```
