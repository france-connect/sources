# Config

This module provides the configuration service for all applications.

## Validation

The module requires validation DTOs to validate provided data.

## General observations


 - Configuration should not provide default or fallback values, if an entry is missing or invalid, the module will exit the application.
 
 
 ## Sharing variables in templates

 This module allows the exposition of variables into templates.  
 To expose a variable, you must configure the module with the option `templateExposed`.  

 The variables are accessible in the `locals.config` namespace.

 Example: 
 ```ts
// /instances/my-app/src/config/config.ts

import { ConfigConfig } from '@fc/config';

export default {
  templateExposed: {
    App: { name: true }, // Expose App.name into templates 
  },
} as ConfigConfig;
 ```

 ```html
<!-- /apps/core-fcp/src/views/template.ejs -->

<%= locals.config.App.name %>
 ```

