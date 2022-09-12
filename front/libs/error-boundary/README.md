# @fc/error-boundary

This component provides a simple and reusable wrapper that you can use to wrap around your components. Any rendering errors in your components hierarchy can then be gracefully handled.

> [**Note from official documentation**](https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries)
>
> Error boundaries do not catch errors for:
>
> Event handlers
> Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
> Server side rendering
> Errors thrown in the error boundary itself (rather than its children)

## Usage

**🤩 Working**

```
import { ErrorBoundaryComponent} from '@fc/error-boundary'

<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>

```

**😵 Not working**

```
import { ErrorBoundaryComponent} from '@fc/error-boundary'

<ErrorBoundary>
  <div>
    MyWidget is cool
  </div>
</ErrorBoundary>

```
