# calcite-link

<!-- Auto Generated Below -->

## Usage

### Basic

```html
<div style="font-size: 16px; font-weight: 400;">
  Some wrapping text
  <calcite-link href="#">link text here</calcite-link>
  around the link
</div>
```

### Focusing

You can programmatically focus a `calcite-link` with the `setFocus()` method:

```html
<div onclick=document.querySelector('#my-link').setFocus()>Focus!</div>
```

## Properties

| Property      | Attribute       | Description                                                                                                                                                                                                                                             | Type                         | Default     |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------- |
| `disabled`    | `disabled`      | is the link disabled                                                                                                                                                                                                                                    | `boolean`                    | `false`     |
| `download`    | `download`      | Prompts the user to save the linked URL instead of navigating to it. Can be used with or without a value: Without a value, the browser will suggest a filename/extension See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download | `boolean \| string`          | `false`     |
| `href`        | `href`          | optionally pass a href - used to determine if the component should render as a link or an anchor                                                                                                                                                        | `string`                     | `undefined` |
| `iconEnd`     | `icon-end`      | optionally pass an icon to display at the end of a button - accepts calcite ui icon names                                                                                                                                                               | `string`                     | `undefined` |
| `iconFlipRtl` | `icon-flip-rtl` | flip the icon(s) in rtl                                                                                                                                                                                                                                 | `"both" \| "end" \| "start"` | `undefined` |
| `iconStart`   | `icon-start`    | optionally pass an icon to display at the start of a button - accepts calcite ui icon names                                                                                                                                                             | `string`                     | `undefined` |
| `rel`         | `rel`           | The rel attribute to apply to the hyperlink                                                                                                                                                                                                             | `string`                     | `undefined` |
| `target`      | `target`        | The target attribute to apply to the hyperlink                                                                                                                                                                                                          | `string`                     | `undefined` |

## Methods

### `setFocus() => Promise<void>`

Sets focus on the component.

#### Returns

Type: `Promise<void>`

## Slots

| Slot | Description             |
| ---- | ----------------------- |
|      | A slot for adding text. |

## Dependencies

### Used by

- [calcite-tile](../tile)

### Depends on

- [calcite-icon](../icon)

### Graph

```mermaid
graph TD;
  calcite-link --> calcite-icon
  calcite-tile --> calcite-link
  style calcite-link fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_