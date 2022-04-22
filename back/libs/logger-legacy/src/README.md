# The `LoggerService.trace()`

## Description

This debugging logger is a tool to trace actions made in every methods to see the working process of all the software.
This logger is specifically made to work with `Chrome Debuger Tool`
This functionality can be deactivated changing manualy the value of a constant declared in `logger-service.ts:20`

```js
const IS_TRACE_OUTPUT: boolean = true | false;
```

## Setup

- Launch normaly the containers, CF: `dsk up fcp-high & dsk start-all`
- Load in a new Chrome tab `chrome://inspect/#devices`
- If it is not already done add in `"Discover network targets > [configure]"` all hosts and ports to listen:
  from `localhost:9229` ... to ... `localhost:9247`
- The active containers will appears, click on "Open dedicated DevTools for Node".
- Activate the source map binding between Chrome and the main.map.js by click on the setting ico
  in the upper right of the Chrome Debug tools, then select `"enable javascript source map"`.

## Implementation

Each software methods should call `LoggerService.trace()` with / or without argument.
The argument will be display and navigable in Chrome.

- The first argument is an object of element to display in `Chrome Debuger Tool`.
- The second argument is the loger level provided by `LoggerLevelNames` enum type, default 'log' for `console.log()`
  Ex:

```js
this.logger.trace({ id, key, data }); // display as a `console.log()`
this.logger.trace({ id, key, data }, LoggerLevelNames.WARN); // display as a `console.warn()`
```

The logger message will appear in `Chrome Debugger Tool` with the add-hoc css and colors, prefixed as follow:

```js
console.log('[time] [container] [library] [class.method}()', { id, key, data });
```
