import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { load, MissingEnv } from "../mod.ts";

Deno.test("unquoted", async () => {
  await load({ path: "./tests/.env" });

  assertEquals(Deno.env.get("FOO"), "bar");
});

Deno.test("quoted", async () => {
  await load({ path: "./tests/.env" });

  assertEquals(Deno.env.get("HELLO"), '"world"');
});

Deno.test("prioritize existing env", async () => {
  Deno.env.set("FOO", "bear");
  await load({ path: "./tests/.env", priorityEnv: true });

  assertEquals(Deno.env.get("FOO"), "bear");
});

Deno.test("throws if file not found", async () => {
  await assertThrowsAsync(
    async () => {
      await load({ path: "./tests/.env2" });
    },
    Deno.errors.NotFound,
  );
});

Deno.test("does not throw if file not found", async () => {
  await load({ path: "./tests/.env2", ignoreMissingFile: true });
});

Deno.test("throws if missing from .env with boolean", async () => {
  await assertThrowsAsync(
    async () => {
      await load({
        path: "./tests/.env",
        exampleFile: "./tests/.env.example",
        verifyAgainstExample: true,
      });
    },
    MissingEnv,
    "DE",
  );
});

Deno.test("succedes with example file", async () => {
  await load({
    path: "./tests/.env.example",
    exampleFile: "./tests/.env",
    verifyAgainstExample: true,
  });
});

Deno.test("defaults to example file if not found", async () => {
  await load({
    path: "./tests/.env",
    exampleFile: "./tests/.env.example",
    verifyAgainstExample: true,
  });
});
