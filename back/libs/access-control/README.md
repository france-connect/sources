# Access Control

This library provides a flexible and type-safe access control system for NestJS applications, allowing fine-grained permission management at the route level.

## Objective

The Access Control library enables applications to:

- Define permissions using decorators on controllers and route handlers
- Check user permissions against entities (with optional entity ID matching)
- Support both global permissions and entity-specific permissions
- Automatically load permissions from the database into the session
- Provide type-safe permission checking with custom handlers

## Description

The access control system works through a combination of:

- **Decorators**: Define required permissions on route handlers
- **Guards**: Enforce permission checks before route execution
- **Handlers**: Custom logic to check permissions (extend `BaseAccessControlHandler`)
- **Interceptors**: Automatically load permissions from database into session
- **Services**: Manage permission storage and retrieval

Permissions are stored in the `PartnersAccountPermission` entity and are automatically loaded into the session via an interceptor. The session must contain a `PartnersAccount` entry with user identity and permissions.

## Core Concepts

### Permission Types

A permission consists of:

- **Permission Type**: A string identifier (e.g., `INSTANCE_CONTRIBUTOR`, `VERSION_EDITOR`)
- **Entity**: Optional entity type (e.g., `SP_INSTANCE`, `SP_VERSION`)
- **Entity ID**: Optional UUID identifying a specific entity instance

### Handler Methods

Handlers define how permissions are checked. Common patterns include:

- **Global Permission**: Check if user has the permission type (regardless of entity)
- **Direct Entity**: Check if user has the permission for a specific entity and entity ID

### Match Types

- **ANY** (default): User must have at least one of the specified permissions
- **ALL**: User must have all of the specified permissions

## Setup

### 1. Create a Permission Handler

Extend `BaseAccessControlHandler` and implement handler methods:

```typescript
import { Injectable } from '@nestjs/common';
import {
  AccessControlPermissionDataInterface,
  BaseAccessControlHandler,
  PermissionInterface,
} from '@fc/access-control';

// Define your enums
enum AccessControlEntity {
  SP_INSTANCE = 'sp_instance',
  SP_VERSION = 'sp_version',
}

enum AccessControlPermission {
  INSTANCE_CONTRIBUTOR = 'instance_contributor',
  VERSION_EDITOR = 'version_editor',
}

enum AccessControlHandler {
  DIRECT_ENTITY = 'directEntity',
  GLOBAL_PERMISSION = 'globalPermission',
}

@Injectable()
export class AppPermissionsHandler extends BaseAccessControlHandler<
  AccessControlEntity,
  AccessControlPermission,
  AccessControlHandler
> {
  // Handler for entity-specific permissions
  private [AccessControlHandler.DIRECT_ENTITY](
    permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    >,
    entityId: string,
    userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission &&
        userPermission.entity === permission.entity &&
        userPermission.entityId === entityId,
    );
  }

  // Handler for global permissions
  private [AccessControlHandler.GLOBAL_PERMISSION](
    permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    >,
    _entityId: string,
    userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): boolean {
    return userPermissions.some(
      (userPermission) =>
        userPermission.permissionType === permission.permission,
    );
  }
}
```

### 2. Import the Module

Import `AccessControlModule` with your handler:

```typescript
import { AccessControlModule } from '@fc/access-control';
import { AppPermissionsHandler } from './handlers/app-permissions.handler';

@Module({
  imports: [
    AccessControlModule.withRolesHandler(AppPermissionsHandler),
    // ... other imports
  ],
})
export class AppModule {}
```

### 3. Configure Session Schema

Ensure your session schema includes the `PartnersAccount` session with permissions:

```typescript
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { AccessControlAccountSession } from '@fc/access-control';

export class AppSession {
  @IsObject()
  @ValidateNested()
  @Type(() => AccessControlAccountSession)
  readonly PartnersAccount: AccessControlAccountSession<
    AccessControlEntity,
    AccessControlPermission
  >;
}
```

## Usage

### Basic Permission Check

Use the `@AccessControl` decorator on route handlers. The guard must be applied, and a least one rule must be defined in the `permissionData` Array (first argument of `@AccessControl`).

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
  PermissionInterface,
} from '@fc/access-control';

@Controller()
export class MyController {
  @Get('/items')
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_VIEW,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  async getItems(
    @AccountPermissions()
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ) {
    // User must have ITEM_VIEW permission
    // Business logic here
  }
}
```

### Entity-Specific Permission Check

Check permissions for a specific entity ID extracted from request parameters:

```typescript
@Get('/items/:itemId')
@AccessControl([
  {
    permission: AccessControlPermission.ITEM_VIEW,
    entity: AccessControlEntity.ITEM,
    handler: {
      method: AccessControlHandler.DIRECT_ENTITY,
    },
    entityIdLocation: { src: 'params', key: 'itemId' },
  },
])
@UseGuards(AccessControlGuard)
async getItem(@Param('itemId') itemId: string) {
  // User must have ITEM_VIEW permission for this specific item
  // The guard extracts itemId from req.params.itemId and checks permission
  // Business logic here
}
```

The `entityIdLocation` tells the guard where to find the entity ID in the request. The guard will extract it and check if the user has the required permission for that specific entity.

### Multiple Permissions (ANY)

User needs at least one of the specified permissions (default behavior). This is useful when different permission levels can access the same resource:

```typescript
@Get()
@AccessControl([
  {
    permission: AccessControlPermission.ITEM_VIEW,
    handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
  },
  {
    permission: AccessControlPermission.ITEM_ADMIN,
    handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
  },
])
@UseGuards(AccessControlGuard)
async getItems() {
  // User must have either ITEM_VIEW OR ITEM_ADMIN
  // Business logic here
}
```

### Multiple Permissions (ALL)

User must have all specified permissions. Use this when an operation requires multiple conditions:

```typescript
import { MatchType } from '@fc/access-control';

@Delete(':itemId')
@AccessControl(
  [
    {
      permission: AccessControlPermission.ITEM_EDIT,
      entity: AccessControlEntity.ITEM,
      handler: { method: AccessControlHandler.DIRECT_ENTITY },
      entityIdLocation: { src: 'params', key: 'itemId' },
    },
    {
      permission: AccessControlPermission.ITEM_DELETE,
      handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
    },
  ],
  { matchType: MatchType.ALL },
)
@UseGuards(AccessControlGuard)
async deleteItem(@Param('itemId') itemId: string) {
  // User must have BOTH:
  // 1. ITEM_EDIT permission for this specific item
  // 2. ITEM_DELETE global permission
  // Business logic here
}
```

### Accessing Permissions in Controllers

Use the `@AccountPermissions` decorator to access user permissions and filter results:

```typescript
import { AccountPermissions, PermissionInterface } from '@fc/access-control';

@Get()
@AccessControl([
  {
    permission: AccessControlPermission.ITEM_VIEW,
    handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
  },
])
@UseGuards(AccessControlGuard)
async getItems(
  @AccountPermissions()
  permissions: PermissionInterface<
    AccessControlEntity,
    AccessControlPermission
  >[],
) {
  // Filter items based on user's permissions
  // Business logic here - use permissions to filter results
}
```

This pattern allows you to return only the entities the user has permission to access, even if they have the global permission to list items.

## Entity ID Location

The `entityIdLocation` option specifies where to extract the entity ID from the request:

- `{ src: 'params', key: 'instanceId' }` - From route parameters (most common)
- `{ src: 'body', key: 'instanceId' }` - From request body
- `{ src: 'query', key: 'instanceId' }` - From query parameters

Example with route parameters:

```typescript
@Get(':instanceId')
@AccessControl([
  {
    permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
    entity: AccessControlEntity.SP_INSTANCE,
    handler: { method: AccessControlHandler.DIRECT_ENTITY },
    entityIdLocation: { src: 'params', key: 'instanceId' },
  },
])
@UseGuards(AccessControlGuard)
async getInstance(@Param('instanceId') instanceId: string) {
  // The guard extracts instanceId from req.params.instanceId
}
```

## Managing Permissions

### Adding Permissions

Use `AccountPermissionService` to add permissions. Inject it in your controller or service:

```typescript
import { AccountPermissionService } from '@fc/access-control';

@Controller()
export class MyController {
  constructor(
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
  ) {}

  async grantPermission(
    accountId: string,
    permissionType: AccessControlPermission,
    entity: AccessControlEntity,
    entityId?: string,
  ): Promise<void> {
    await this.accessControl.addPermission({
      accountId,
      permissionType,
      entity,
      entityId,
    });
  }
}
```

> **Note**: For entity creation, prefer using `addPermissionTransactional` to ensure atomicity (see below).

### Adding Permissions in Transactions

For transactional operations (recommended when creating entities):

```typescript
import { QueryRunner } from 'typeorm';
import { AccountPermissionService } from '@fc/access-control';
import { Session, ISessionService } from '@fc/session';

@Controller()
export class MyController {
  constructor(
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    // ... other services
  ) {}

  @Post()
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_CREATE,
      handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
    },
  ])
  @UseGuards(AccessControlGuard)
  async createItem(
    @Body() data: any, // Your DTO
    @Session('PartnersAccount', PartnersAccountSession)
    session: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ) {
    const {
      identity: { id: accountId },
    } = session.get();

    // Create item and grant permission in a transaction
    await this.typeormService.withTransaction((queryRunner: QueryRunner) =>
      this.createItemInDatabase(queryRunner, data, accountId),
    );
  }

  private async createItemInDatabase(
    queryRunner: QueryRunner,
    data: any,
    accountId: string,
  ): Promise<void> {
    // Create the entity (business logic)
    const { id: itemId } = await this.itemService.save(queryRunner, data);

    // Grant permission to the creator within the same transaction
    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.ITEM_EDIT,
      entity: AccessControlEntity.ITEM,
      entityId: itemId,
    });
  }
}
```

This ensures that if entity creation fails, the permission is not granted, maintaining data consistency.

## Complete Example

Here's a complete example showing the full flow from listing to creating items:

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
  AccountPermissionService,
  PermissionInterface,
} from '@fc/access-control';
import { Session, ISessionService } from '@fc/session';

@Controller()
export class ItemController {
  constructor(
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    // ... other services
  ) {}

  // List items (user must have global permission)
  @Get('/items')
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_VIEW,
      handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
    },
  ])
  @UseGuards(AccessControlGuard)
  async getItems(
    @AccountPermissions()
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ) {
    // Filter to only return items user has access to
    // Business logic here
  }

  // Get specific item (user must have permission for this item)
  @Get('/items/:itemId')
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_VIEW,
      entity: AccessControlEntity.ITEM,
      handler: { method: AccessControlHandler.DIRECT_ENTITY },
      entityIdLocation: { src: 'params', key: 'itemId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  async getItem(@Param('itemId') itemId: string) {
    // Business logic here
  }

  // Create item and grant permission to creator
  @Post('/items')
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_CREATE,
      handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
    },
  ])
  @UseGuards(AccessControlGuard)
  async createItem(
    @Body() data: any, // Your DTO
    @Session('PartnersAccount', PartnersAccountSession)
    session: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ) {
    const {
      identity: { id: accountId },
    } = session.get();

    // Create item and grant permission atomically
    await this.typeormService.withTransaction((queryRunner: QueryRunner) =>
      this.createItemInDatabase(queryRunner, data, accountId),
    );
  }

  // Update item (user must have permission for this specific item)
  @Put('/items/:itemId')
  @AccessControl([
    {
      permission: AccessControlPermission.ITEM_EDIT,
      entity: AccessControlEntity.ITEM,
      handler: { method: AccessControlHandler.DIRECT_ENTITY },
      entityIdLocation: { src: 'params', key: 'itemId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  async updateItem(@Body() data: any, @Param('itemId') itemId: string) {
    // Business logic here
  }

  private async createItemInDatabase(
    queryRunner: QueryRunner,
    data: any,
    accountId: string,
  ): Promise<void> {
    // Create the entity (business logic)
    const { id: itemId } = await this.itemService.save(queryRunner, data);

    // Grant permission to creator within the same transaction
    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.ITEM_EDIT,
      entity: AccessControlEntity.ITEM,
      entityId: itemId,
    });
  }
}
```

## How It Works

1. **Interceptor**: On each request, `AccessControlSessionInterceptor` loads permissions from the database based on the user's email and stores them in the session.

2. **Guard**: `AccessControlGuard` executes before route handlers and:
   - Reads permission metadata from the `@AccessControl` decorator
   - Extracts user permissions from the session
   - Calls the appropriate handler method to check permissions
   - Allows or denies access based on the result

3. **Handler**: Custom handler methods implement the permission checking logic:
   - Receive the permission configuration, entity ID, and user permissions
   - Return `true` if the user has the required permission, `false` otherwise

## Session Structure

The session must contain a `PartnersAccount` entry with the following structure:

```typescript
{
  identity: {
    id: uuid; // Account ID (used when granting permissions)
    email: string; // Used by interceptor to load permissions
  }
  permissions: Array<{
    entityId?: uuid;
    entity?: EntityType;
    permissionType: PermissionType;
  }>;
}
```

The interceptor automatically loads permissions from the database based on the user's email and stores them in the session. Permissions are frozen (immutable) to prevent accidental modification.

### Accessing Session Data

To access the account ID when granting permissions:

```typescript
import { Session, ISessionService } from '@fc/session';

@Post()
@AccessControl([...])
@UseGuards(AccessControlGuard)
async createEntity(
  @Body() data: any, // Your DTO
  @Session('PartnersAccount', PartnersAccountSession)
  session: ISessionService<
    PartnersAccountSession<AccessControlEntity, AccessControlPermission>
  >,
) {
  const {
    identity: { id: accountId },
  } = session.get();

  // Use accountId to grant permissions
  await this.accessControl.addPermission({
    accountId,
    permissionType: AccessControlPermission.ITEM_EDIT,
    entity: AccessControlEntity.ITEM,
    entityId: newItemId, // From your business logic
  });
}
```

## Combining with Other Guards

You can combine `AccessControlGuard` with other guards. Guards are executed in order:

```typescript
@Post()
@AccessControl([
  {
    permission: AccessControlPermission.ITEM_CREATE,
    handler: { method: AccessControlHandler.GLOBAL_PERMISSION },
  },
])
@UseGuards(AccessControlGuard)  // Checks permissions first
@UseGuards(OtherGuard)         // Then other guards
async createItem(@Body() data: any) {
  // Handler executes only if all guards pass
  // Business logic here
}
```

## Type Safety

The library is fully typed using TypeScript generics:

- `EntityType`: Type of entities in your system
- `PermissionType`: Type of permissions
- `PermissionHandlerType`: Type of handler method names

This ensures compile-time safety when defining permissions and handlers. All decorators, services, and handlers are typed accordingly.

## Exports

The library exports:

- `AccessControlModule`: Main module
- `AccessControl`: Decorator for route handlers
- `AccessControlGuard`: Guard to enforce permissions
- `AccountPermissions`: Decorator to access permissions in controllers
- `BaseAccessControlHandler`: Base class for permission handlers
- `AccountPermissionService`: Service for managing permissions
- `AccessControlAccountSession`: DTO for session structure
- `MatchType`: Enum for match types (ALL, ANY)
- Various interfaces and types for type safety
