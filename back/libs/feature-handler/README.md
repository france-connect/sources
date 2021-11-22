# Library FeatureHandler

## Objective

This library implements the mechanics and validation of the Feature Handler classes.

## Description

The FeatureHandler engine allows to register Task classes to defined process in FC cinematic in order to avoid a large and complex group of 'if' statements to adapt the process to the situation.

This architecture based on Strategic Design Pattern allows us to separate the process architecture from the task execution.

Each Identity provider has its corresponding class to adapt to FC list of process (Email to User, Check of Identity...).

We use the Decorator pattern to register and link the Task class to the Process with any complexe Services Architecure.

```typescript
// Basic usage of FeatureHandler.
@FeatureHandler('MyProcessStep')
class MySuperClass implements IFeatureHandler<string> {
  constructor(public readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  async handle(_arg: any): Promise<string> {
    this.logger.debug('getCheck service: ##### MySuperClass');
    return 'Super Feature';
  }
}
```

Then when you want to use the Feature :

```typescript
// Basic use of a Feature

const idp = await this.identityProvider.getById<TypeOfProcess>(idpId);

// The FeatureHandlers are stored in the database
const idClass = idp.featureHandlers['MyProcessStep'];

// get the class previously defined
const handler = await FeatureHandler.get<string>(idClass, this);

// Apply the process of the class with a generic call of the function 'handle'
const myData = await handler.handle('What My Class is waiting for');
```

Do not forget in database to have the featureHandlers property to be defined

```typescript
// @example <caption>Basic structure of a MongoDB database.</caption>
{
  featureHandlers : {
    coreVerify, // <== process used by FeatureHandler
    idpIdentity,
    anyProcessUseful,
  },
}
```
