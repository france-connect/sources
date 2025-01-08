# @fc/dto2form

## Usage

```
const schema = loadSchemaFromApi() as JSONFieldType[];

return (
  <DTO2FormComponent<ProviderFormValues>
    config={{ id: 'dto-form-example' }}
    initialValues={{ uid }}
    schema={schema}
    onSubmit={() => {}}
  />
);
```
