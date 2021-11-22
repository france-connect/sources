#### Usage

```css
.(m|p)[direction][variable];
```

#### Directions

- `m` > génére une marge sur `top`, `right`, `bottom`, `left`
- `mx` > génére une marge sur `right`, `left`
- `my` > génére une marge sur `top`, `bottom`
- `mt` | `mr` | `mb` | `ml` > génére une marge sur une des quatre directions

#### Variables

```css
$Spacings: (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 96, 120) !default;
```

#### Exemples

?> Ajoute une marge à droite de `12px` (transformée en `rem`)

```css
.my-button {
  @extend .mr12;
}
```

?> Ajoute une padding à droite et à droite de `24px` (transformée en `rem`)

```html
<button type="button" class="px24">
  <span>Click me !</span>
</button>
```
