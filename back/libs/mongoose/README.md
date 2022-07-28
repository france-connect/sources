# Mongoose

## Documentation

- https://docs.nestjs.com/techniques/mongodb#multiple-databases
- https://www.learmoreseekmore.com/2020/04/nestjs-multiple-mongodb-databases.html
- https://mongoosejs.com/docs/api/connection.html

## Objective

The library implements the mechanics to control MongoDb database through mongoose helper.

## Description

This library helps to implement Mongoose Module in all other libs and apps with context and tracking activities of the database.

To start a basic Mongo Connection, just add :

```typescript
import { MongooseModule } from '@fc/mongoose';

MongooseModule.forRoot();
```

You can specify a specific connection name :

```typescript
import { MongooseModule } from '@fc/mongoose';

MongooseModule.forRoot('MongooseLegacy');
```

> Caution: your connection name is the exact name of your config apps parameter (default is "Mongoose").
> Exemple of config:

```yaml
- 'Mongoose_HOSTS=host:port'
- 'Mongoose_DATABASE=DatabaseName'
- 'Mongoose_USER=MainUser'
- 'Mongoose_PASSWORD=MainPasword'
- 'Mongoose_TLS=true'
- 'Mongoose_TLS_INSECURE=false'
- 'Mongoose_TLS_CA_FILE=myCertificat.crt'
- 'Mongoose_TLS_ALLOW_INVALID_HOST_NAME=false'
```

### Models

Add model with the following module :

```typescript
import { MongooseModule } from '@fc/mongoose';
MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]);
```

You can also add a specific connection name :

```typescript
import { MongooseModule } from '@fc/mongoose';
MongooseModule.forFeature(
  [{ name: 'Account', schema: AccountSchema }],
  'MongooseLegacy',
);
```

> Caution: your connection name is the exact name of your config apps parameter (default is "Mongoose").
