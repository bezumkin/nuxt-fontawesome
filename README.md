> Module to use [Font Awesome 6](https://fontawesome.com) icons in your **Nuxt 3** project.

This module **does not use** [vue-fontawesome](https://github.com/FortAwesome/vue-fontawesome) under the hood as dependency, 
but contains some code from its sources to implement its features with [Nuxt Universal Render](https://nuxt.com/docs/guide/concepts/rendering), also known as `ssr: true` in config.

The main difference from official component is creating real tags in `template` instead of rendering nodes in browser. That is why it works on server.

I tried to implement as many features I could (like `mask`, `transform` and `symbol`) but not sure if everything works the same way as in `vue-fontawesome`.

Please use [issues](https://github.com/bezumkin/nuxt-fontawesome/issues) to report problems.

## Setup
- Add dependency to your project
```bash
npx nuxi@latest module add @vesp/nuxt-fontawesome
```

- Add some icon packs
```bash
npm i -D @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
```

- Add `@vesp/nuxt-fontawesome` to `modules` in your `nuxt.config.ts`
- Configure loaded icons

Use the `fontawesome` key:
```js
  // nuxt.config.ts
  modules: [
    '@vesp/nuxt-fontawesome',
  ],
  fontawesome: {
    icons: {
      solid: ['cog', ...],
      ...
    }
  }
}
```

## Module options

### `component`
- Default: `font-awesome`

Default component name is `<font-awesome icon="" ... />`, and you can change that here.
For example, if you will specify `fa`, it will become `<fa icon="" ... />`.
Also see [suffix](#suffix).

### `useLayers`
- Default: `true`

Boolean to indicate if the layers component should be registered globally.
Name of the component will be `${options.component}-layers`, and `<font-awesome-layers ... />` by default.

### `useLayersText`
- Default: `true`

Boolean to indicate if the layers component should be registered globally.
Name of the component will be the `${options.component}-layers-text`, and `<font-awesome-layers-text ... />` by default.

### `icons`

Which icons you will use. FontAwesome [currently](https://fontawesome.com/docs/web/add-icons/how-to) supports up to 5 icon styles in 3 families.

This option is an object with the style names as property and an array with all icon names you wish to use from those styles

```js
  icons: {
    solid: ['coffee', 'child', ... ],
    regular: ['comment', ... ],
    brands: ['twitter', ... ],
  },
  proIcons: {
    solid: [],
    regular: [],
    light: [],
    thin: [],
    duotone: [],
  },
  sharpIcons: {
    solid: [], 
    regular: [],
    light: [],
    thin: [],
  }
```

### `addCss`
- Default: `true`

If the module should automatically add the fontawesome styles to the global css config. It works by unshifting `@fortawesome/fontawesome-svg-core/styles.css` onto the Nuxt `css` property.

### `suffix`
- Default: `true`

Boolean whether to append `-icon` to the icon component name. This option exists as the component name option is also used for the layer components and you might not want to add '-icon' to those.

```js
  // config
  component: 'fa',
  suffix: true

  // usage
  <fa-icon />
  <fa-layers />
  <fa-layers-text />
```
```js
  // config
  component: 'fa',
  suffix: false

  // usage
  <fa />
  <fa-layers />
  <fa-layers-text />
```

## Usage
You can find more details under [playground](https://github.com/bezumkin/nuxt-fontawesome/tree/main/playground) folder.

- Ensure you have installed an icon package
  `npm i -D @fortawesome/free-solid-svg-icons`
- and have added the module configuration to your `nuxt.config.js`

Default component names are:
- `<font-awesome>`
- `<font-awesome-layers>`
- `<font-awesome-layers-text>`

You can change this names by [component option](#component).
```js
  // nuxt.config
  fontawesome: {
    icons: {
      solid: ['dollar-sign', 'cog', 'circle', 'check', 'calendar'],
      regular: ['user']
    }
  }
```

- Use global icons:
```vue
<template>
  <div>
    <font-awesome :icon="['far', 'user']" />
    <font-awesome icon="dollar-sign" style="font-size: 30px" />
    <font-awesome icon="cog" />

    <font-awesome-layers class="fa-4x">
      <font-awesome icon="circle" />
      <font-awesome icon="check" transform="shrink-6" :style="{color: 'white'}" />
    </font-awesome-layers>

    <font-awesome-layers full-width class="fa-4x">
      <font-awesome icon="calendar" />
      <font-awesome-layers-text transform="shrink-8 down-3" value="27" class="fa-inverse" />
    </font-awesome-layers>
  </div>
</template>

<script></script>

```

- Use locally imported icons
```vue
<template>
  <div>
    <font-awesome-layers full-width size="4x">
      <font-awesome :icon="faCircle" />
      <font-awesome-layers-text transform="shrink-12" value="GALSD" class="fa-inverse" />
    </font-awesome-layers>

    <font-awesome :icon="faAddressBook" />
    <font-awesome :icon="faGithub" />
  </div>
</template>

<script setup>
import {faCircle, faAddressBook} from '@fortawesome/free-solid-svg-icons'
import {faGithub} from '@fortawesome/free-brands-svg-icons'
</script>
```

## License

[MIT License](./LICENSE.md)

This module was inspired by official [Nuxt 2 module](https://github.com/nuxt-community/fontawesome-module) from **Nuxt Community**.

Some code and function was taken from [vue-fontawesome](https://github.com/FortAwesome/vue-fontawesome) repository to implement its features with server rendering. 
