# Add new entity

to create a new entity with Typeorm, please the following command:

```bash
yarn typeorm -- entity:create ./entities/typeorm/AccountRole
```

# To migrate

To launch the migration process, the stack must be up and then launch the following command with your issue reference:

```
docker-stack migrations-generate-partners-fcp migrations/partners-fcp/FC-XXXX
```

It will produce a Postgres migration batch for the database in the correct directory.
Adapt the script easily to FCA just by changing fcp to fca.

⚠️ There is a bug in the script, Typeorm ignore our typeorm.config.js, for the moment you have to set the entire path (migrations/partners-fcp/) to correctly order the file in the good directory.
