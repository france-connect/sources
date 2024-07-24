# @fc/styles

## Breakpoints Reference/Wording

[DSFR Breakpoints Values](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/grille-et-points-de-rupture/)

- `lt` prefix : `Less Than`
- `gt` prefix : `Greater Than`

| DSFR Token      | Value (px) | Variable Name           |
| --------------- | ---------- | ----------------------- |
| --breakpoint-xs | 320        | `${prefix}SmallMobile`  |
| --breakpoint-sm | 576        | `${prefix}Mobile`       |
| --breakpoint-md | 768        | `${prefix}Tablet`       |
| --breakpoint-lg | 992        | `${prefix}Desktop`      |
| --breakpoint-xl | 1440       | `${prefix}LargeDesktop` |

## useStylesVariables

Used to get the value of any CSS variable into the `:root` pseudo-elements  
Return an array of string/number

```typescript
// a string as value
const [breakpointLg] = useStylesVariables('breakpoint-lg');

// an array as value
const [breakpointMd] = useStylesVariables(['--breakpoint-md']);

// with an array of variables names
const [breakpointLg, colorAny] = useCSSVariable(['breakpoint-lg', '--color-any']);

// with a single transformer
const [breakpointMd] = useStylesVariables(['--breakpoint-lg'], stringToNumber);

// with an array of transformers
const [breakpointLg, somethingToWathever] = useStylesVariables(
  ['--breakpoint-lg', '--something-to-wathever'],
  [stringToNumber, somethingToWatheverTransformer],
);
```

## useStylesQuery

Return a boolean for a CSS media-query

```typescript
// greaterThan when minWidth is used into the media query
const gtMobile = useStylesQuery({ minWidth: '680px' });

// lowerThan when maxWidth is used into the media query
const ltMobile = useStylesQuery({ maxWidth: '680px' });

// A string can be used into the media query
const gtDesktop = useStylesQuery({ 'min-width': 730 });

//
const gtMobile = useStylesQuery({ minWidth: '680px', maxWidth: 720 });
```
