# Library Dto2Form

## Objective

This library provides a simple way to define a form schema, using class-validator style DTOs as a definition file.  
This allows the backend to describe the form structure and validations rules.

The front does not need to carry business logic for each form, the schema provides all needed information.

⚠️ DTO is **NOT** from class-validator, but a custom DTO.
This is mostly because we don't want to reverse engineer the DTO to get the validation rules, and class-validator has its own metadata system instead of `Reflect`.

## Description

### Create a form DTO

1. A form DTO is declared by decorating a class with `@Form()`. This decorator will ensure that the metadata are correctly set.
2. Each property of the class is a field of the form, and should be decorated with the corresponding type `@Input()`, `@Select()`, `@Number()`, (see [fields folder](./src/decorators/fields) for an exhaustive list)...
3. Each type of field has its own properties. Some are mandatory for all fields like `required` or `validators` (At least one validator **MUST** be defined).
   Some are optional like `validateIf` (see after). Other are specific to the field like `options` for `@Select()`.
4. All fields attributes like `name` and `label` are automatically deducted to keep the DTO as simple as possible and easy to manage with internationalization (i18n).:
   - `name` => `<property_name>`
   - `label` => `<property_name>_label`;
   - `errorMessage` => `<property_name>_<validator_name>_error`;
5. You can order fields by using the `order` attribute. If not set, the fields will be sorted by property name in the class (Please note that EcmaScript does not ensure property order, but most implementations are so).
6. Each validator **MUST** use a `descriptor` (beginning with `$`) linked to a validation function.
   This is to ensure that the validation function is correctly linked to the DTO as well as keep a clean declarative structure.
   You can create your own validators and corresponding descriptors, or use the ones provided by the library `validatorsjs` or the `validator-custom` service.

```typescript
@Form()
export class MyFormDto {
  @Input({
    required: true,
    order: 1,
    validators: [$IsNotEmpty(), $Match(/[a-z]+/i)],
  })
  name: string;

  @Select({
    required: true,
    order: 6,
    validators: [$IsNotEmpty()],
    options: ['option1', 'option2'],
  })
  select: string;

  @Number({ required: true, order: 2, validators: [$IsNotEmpty()] })
  number: number;

  @Date({ required: true, order: 4, validators: [$IsNotEmpty()] })
  date: Date;

  @Checkbox({ required: true, order: 3, validators: [$IsNotEmpty()] })
  checkbox: boolean;

  @Textarea({ required: true, order: 5, validators: [$IsNotEmpty()] })
  textarea: string;

  @Input({
    required: true,
    validators: [$IsNotEmpty()],
    validateIf: [$IfFieldNotEmpty('textarea')],
  })
  conditional: string;
}
```

### Render the form

To render the form, you must call the `getDtoMetadata()` method from the `dto2form` service, passing in the DTO for which you want to retrieve metadata.

```typescript
const payload = this.metadataFormService.getDtoMetadata(MyFormDto);
```

### Validation

To validate a form, you need to decorate your POST request handler with `@UsePipes(FormValidationPipe)`. Then you add the DTO as the type of `@Body()` or `@Query()`: `@Body() body: MyDto`.

```typescript
@Controller('my')
export class MyController {
  @Post('action')
  @UsePipes(FormValidationPipe)
  async create(@Body() body: MyFormDto) {
    // ...
  }
}
```

Emitted errors are formatted as follow and **SHOULD** be caught by an exception filter that either send them as response or generate a page depending on the context:

```json
[
  {
    "name": "<field_name_label>",
    "errors": ["<error_label>", "<error_label>", "..."]
  },
  {
    "name": "<field_name_label>",
    "errors": ["<error_label>", "<error_label>", "..."]
  }
]
```

This object is currently emitted as a `Dto2FormValidationErrorException` with the errors as parameter.

### Custom validators

You can create your own validators to match your needs.
You can then use them in your DTO, by creating a descriptor linked to the validator.

A validator is a function that takes:

- The value to validate, as first parameter
- X arguments given to the descriptor, if needed
- The custom validation options object, as the last parameter (always given by the `FormValidationPipe`)

The function **MUST** return a boolean or a Promise resolving to a boolean.

```typescript
function IsMoreComplex(
  value: unknown,
  arg1: string,
  arg2: number,
  validationOptions: CustomValidationOptionsBase,
): boolean {
  return value === arg1 && context.get('someValue') === arg2;
}

export function $IsMoreComplex(
  ...validationArgs: IsMoreComplexValidator['validationArgs']
): IsMoreComplexValidator {
  return {
    name: ValidatorCustom.IsMoreComplex,
    validationArgs,
  };
}
```

### Conditional validation

You can create custom conditional validation rules to match your needs.
Then you can use them in your DTO by creating a descriptor linked to the validator.

A conditional validation rule is a function that takes:

- The value to validate, as first parameter, if needed
- X arguments given to the descriptor, if needed
- The custom validation options object, as the last parameter (always given by the `FormValidationPipe`)

The function **MUST** return a boolean or a Promise resolving to a boolean.

```typescript
function IfFieldNotEmpty(
  value: unknown,
  field: string,
  validationOptions: CustomValidationOptionsBase,
): boolean {
  return !!context.get(field);
}

export function $IfFieldNotEmpty(
  ...ruleArgs: IfFieldNotEmptyValidateIfRule['ruleArgs']
): IfFieldNotEmptyValidateIfRule {
  return {
    name: ValidateIfRule.IfFieldNotEmpty,
    ruleArgs,
  };
}
```

### Custom validation options

Currently, the custom validation options only contain the `target` of the DTO. This is to allow the validation function to access the full object, if needed.

### Complex and asynchronous validator

As they are injectable services, ValidateIfRulesService and ValidatorCustomService can benefit from NestJS dependency injection system. This allows you to inject other services or repositories to perform complex or asynchronous validation (from configuration, databases, or any other service with your imagination as the only limit). All those calls can be either synchronous or asynchronous.

See `libs/dto2form/src/services/validate-if-rules.service.ts`, `libs/dto2form/src/services/validator-custom.service.ts` and [NestJS documentation](https://docs.nestjs.com/providers#services) for more information.
