#### Usage

```css
.fs[variable];
```

#### Variables

```css
$Spacings: (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72) !default;
```

#### Exemple

?> Un texte avec une taille de `12px` (transformée en `rem`).

```css
.my-button {
  @extend .fs12;
}
```

```html
<button type="button" class="fs12">
  <span>Click me !</span>
</button>
```
