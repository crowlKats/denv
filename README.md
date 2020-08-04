# denv
A module similar to [dotenv](https://github.com/motdotla/dotenv), but for Deno

## Usage
You can import the `load` function which will use the `.env` file from the current directory, or you can pass the path to an `env` file:
```ts
import { load } from "https://deno.land/x/denv@1.0.0/mod.ts";
await load("myenvfile");
```

## Env File Rules
The rules are the same as dotenv, except `double quoted values expand new lines` is not implemented 
