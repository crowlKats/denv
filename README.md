# denv

A module similar to [dotenv](https://github.com/motdotla/dotenv), but for Deno

## Usage

You can import the `load` function which will use the `.env` file from the
current directory, or you can pass the path to an `env` file. Here is an
example with all default values:

```ts
import { load } from "https://deno.land/x/denv@2.0.0/mod.ts";
await load({
  /** The path of the env file */
  path: ".env",
  /** If true, won't overwrite existing variables */
  priorityEnv: false,
  /** Will not throw an error if file is not found */
  ignoreMissingFile: false,
});
```

## Env File Rules

The rules are the same as dotenv, except `double quoted values expand new lines`
is not implemented
