import { assertEquals } from "https://deno.land/std@0.63.0/testing/asserts.ts";
import { load } from "../mod.ts";

Deno.test("unquoted", async () => {
  await load("./tests/.env");

  assertEquals(Deno.env.get("FOO"), "bar");
});

Deno.test("quoted", async () => {
  await load("./tests/.env");

  assertEquals(Deno.env.get("HELLO"), "\"world\"");
});
