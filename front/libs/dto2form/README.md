# @fc/dto2form

## Usage

```
const schema = loadSchemaFromApi() as SchemaFieldType[];

return (
  <DTO2FormComponent<ProviderFormValues>
    config={{ id: 'dto-form-example' }}
    initialValues={{ uid }}
    schema={schema}
    onSubmit={() => {}}
  />
);
```
