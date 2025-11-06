# @fc/dto2form

## Usage

```
const schema = loadSchemaFromApi() as SchemaFieldType[];

return (
  <Dto2FormComponent<ProviderFormValues>
    config={{
      id: 'dto-form-example',
      submitLabel: 'envoyer ces informations'
    }}
    initialValues={{ uid }}
    schema={schema}
    onSubmit={() => {}}
  />
);
```
