# MongooseChangeStream Library

This library provides a service for watching MongoDB change streams through Mongoose models.

## Features

- Watch MongoDB change streams for specific operations (insert, update, delete, rename, replace)
- Automatic reconnection handling
- Configurable callbacks for change events
- Built as a singleton service

## Usage

```typescript
import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';

// Inject the service and watch a model
mongooseChangeStreamService.registerWatcher(MyModel, () => {
  console.log('Change detected in MyModel collection');
});
```
