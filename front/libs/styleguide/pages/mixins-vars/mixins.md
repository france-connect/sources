##### fontSize(px);

> Génére une propriété `font-size` CSS en `rem` avec sa valeur de fallback en `px`

```css
@include fontSize(number);
// font-size: [value]px;
// font-size: [value]rem;
```

##### height(value);

> Génére une propriété `height` CSS en `%`

```css
@include height(number);
// height: [value]%;
```

##### lineHeight(px);

> Génére une propriété `line-height` CSS en `rem` avec sa valeur de fallback en `px`

```css
@include lineHeight(number);
// line-height: [value]px;
// line-height: [value]rem;
```

##### width(value);

> Génére une propriété `width` CSS en `%`

```css
@include width(number);
// width: [value]%;
```

#### UTILS

##### number-to-pixel(number)

> Retourne une valeur formatée en `rem`

```css
$pixelValue: number-to-pixel($number);
```

##### rem(prop, pixelValue)

> Retourne une valeur formatée en `rem`

```css
@include rem(margin, $pixelValue);
// margin: [value]rem;
```
