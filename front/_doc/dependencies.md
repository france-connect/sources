# Dependencies specificities

## react-scripts & yarn workspaces

We use [create-react-app](https://create-react-app.dev/) and [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/).  
Those two technologies do not play well together out of the box, so we have to make few things to make tests work from the root of the `front` folder and to use aliases for shared code.


 * Manually add needed devDependencies in the monorepo's root [package.json](../package.json) file.  
   > _Note that app or lib specific (dev)dependencies should live inside relative package.json._
 * Keep a version of tools compatible with what [react-scripts](https://www.npmjs.com/package/react-scripts) expects
 * Override tsconfig.json files in applications in order to have [typescript paths resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) for our internal libraries (ie. `@fc/some-lib`).
