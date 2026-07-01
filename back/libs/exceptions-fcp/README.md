# Error Management Library for the FranceConnect Error Page

This library exposes `ExceptionsFcpModule` and `ExceptionsFcpService`, which allow you to customize the content displayed on the FCP error page (message, title, link, and action button label) for specific error codes through application configuration.

## Quick access to current configuration

| App           | Config file                                                          | Translation files                                                                                                   |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| core-fcp-low  | [config](../../instances/core-fcp-low/src/config/exceptions-fcp.ts)  | [app](../../apps/core-fcp/src/i18n/fr-FR.i18n.ts), [instance](../../instances/core-fcp-low/src/i18n/fr-FR.i18n.ts)  |
| core-fcp-high | [config](../../instances/core-fcp-high/src/config/exceptions-fcp.ts) | [app](../../apps/core-fcp/src/i18n/fr-FR.i18n.ts), [instance](../../instances/core-fcp-high/src/i18n/fr-FR.i18n.ts) |

## Behavior

For a given error code, the service looks for an item whose `errorCode` matches.

- **No item** for this code: no support action button.
- **Item with `active: false`**: The default action button is shown, it links to the support form with the current error code as parameter.
- **Item with `active: true`**: The button text and target are customizable, as well as the error message and the "action block" title.

## Example

Reference in the repository: `back/instances/core-fcp-low/src/config/exceptions-fcp.ts` (and the equivalent in `core-fcp-high`). Simplified example:

```ts
import { ExceptionsFcpConfig } from '@fc/exceptions-fcp';

export default {
  items: [
    { errorCode: 'Y600007', active: false }, // Will show the button leading Support Form
    {
      errorCode: 'Y100011', // Will show the button leading to `actionHref`, here the FAQ
      active: true,
      errorMessage: 'error.faq.y100011.body',
      actionTitle: 'error.faq.title',
      actionButtonLabel: 'error.faq.button_label',
      actionHref: 'https://aide.franceconnect.gouv.fr/faq/...',
    },
  ],
} as ExceptionsFcpConfig;
```

## Configuration Schema

### `ExceptionsFcpConfig`

| Property | Type                        | Description                  |
| -------- | --------------------------- | ---------------------------- |
| `items`  | `ExceptionsFcpConfigItem[]` | List of rules by error code. |

### `ExceptionsFcpConfigItem`

| Property            | Required | Description                                                                                                                      |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `errorCode`         | yes      | Target error code (for example `Y100011`), as passed to service methods.                                                         |
| `active`            | yes      | If `true`, overrides (message, title, link, button label) are applied for this code. If `false`, default action button is shown. |
| `errorMessage`      | no       | Text for the custom error message body, used instead of the original message when the item is active.<sup>\*</sup>               |
| `actionTitle`       | no       | Text for the action/help block title associated with the error.<sup>\*</sup>                                                     |
| `actionButtonLabel` | no       | Text for the button label (required in practice if you customize the button).<sup>\*</sup>                                       |
| `actionHref`        | no       | URL used by the action button (replaces the default `href` when the item is active).                                             |

> <sup>\*</sup> All texts are set through i18n keys.

Optional fields are validated with `class-validator` (`@IsOptional()`). `errorCode` and `active` are required for each item.

## Integration

- Import `ExceptionsFcpModule` in the application (for example `core-fcp`).
- The configuration structure is validated by `ExceptionsFcpConfig`, referenced in the application's global DTO under the **`ExceptionsFcp`** key.
- In each instance (`core-fcp-low`, `core-fcp-high`, etc.), a dedicated file (for example `src/config/exceptions-fcp.ts`) exports the configuration object; this module is then aggregated in `src/config/index.ts` with the `ExceptionsFcp` key.

The service reads the configuration using `ConfigService.get<ExceptionsFcpConfig>('ExceptionsFcp')`.
