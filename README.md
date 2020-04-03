# denv
A module similar to [dotenv](https://github.com/motdotla/dotenv), but for Deno

## Usage
You can directly import it, and it will use the `.env` file of the directory it is imported in:
```ts
import "https://deno.land/x/denv/mod.ts";
```
else you can import the `load` function, where you can pass the path to the `.env` file:
```ts
import {load} from "https://deno.land/x/denv/mod.ts";
await load("myenvfile");
```

## Env File Rules
The rules are the same as dotenv, except `double quoted values expand new lines` is not implemented 
