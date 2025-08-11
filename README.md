# @runtimed/extensions

This package provides the common interfaces needed to plug into the Runtime Web framework and implement custom behavior

# Usage

```ts
import type { BackendExtension } from '@runtimed/extensions';
const extension: BackendExtension = {
  apiKey:...
};
export default extension;
```

Once developed, see the documentation at [@runtimed/anode](https://github.com/runtimed/anode) for more information on how to import and use the extension

# Error handling

All extension functions should wrap and throw a standard error defined in [errors.ts](./src/errors.ts)
That way, a proper status code and structured error will be returned to interested clients. All errors thrown by an extension not otherwise handled will become an Unknown (500) status code
