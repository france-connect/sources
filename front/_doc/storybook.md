# Storybook

## Why Storybook?

The tool enables developers to create components independently and showcase
components interactively in an isolated development environment. Storybook runs
outside of the main app so users can develop UI components in isolation without
worrying about application-specific dependencies and requirements.

## How to Use It

You can run this command to watch for your Storybook changes:

```
yarn storybook
```

or

```
docker-stack up min-storybook
docker-stack dep-all
docker-stack start-all
```

When you create a new component, add stories for it in a story file:
`MyComponent.stories.tsx`. The
default export should be the description of your stories:

```js
export default {
  component: MyComponent,
  title: 'lib/component/MyComponent',
};
```

Named exports will all render a new item under your component in the
Storybook:

```jsx
export const Default = () => <MyComponent />;
export const Foo = () => <MyComponent variant="foo" />;
```
