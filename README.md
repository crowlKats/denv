# denv

A module similar to [dotenv](https://github.com/motdotla/dotenv), but for Deno

## Usage

You can import the `load` function which will use the `.env` file from the
current directory, or you can pass the path to an `env` file. Here is an example
with all default values:

```ts
import { load } from "https://deno.land/x/denv@3.0.0/mod.ts";
await load({
  /** The path of the env file, defaults to ".env" */
  path: ".env",
  /** If true, won't overwrite existing variables */
  priorityEnv: false,
  /** Will not throw an error if file is not found */
  ignoreMissingFile: false,
  /** If true, will verify the final environment against the example file */
  verifyAgainstExample: false,
  /** If true, will fallback to the example file */
  defaultToExample: false,
  /** Path to example file, defaults to ".env.example" */
  exampleFile: ".env.example",
});
```

## Env File Rules

The rules are the same as dotenv, except `double quoted values expand new lines`
is not implemented
