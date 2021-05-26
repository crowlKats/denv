interface LoadOptions {
  /** The path of the env file */
  path?: string;
  /** If true, won't overwrite existing variables */
  priorityEnv?: boolean;
  /** Will not throw an error if file is not found */
  ignoreMissingFile?: boolean;
  /** If true or path, will verify the environment against the example file */
  verifyAgainstExample?: boolean | string;
}

export class MissingEnv extends Error {}

export function parse(string: string): Record<string, string> {
  const lines = string.split(/\n|\r|\r\n/).filter((line) =>
    line.startsWith("#") ? false : !!line
  );

  return Object.fromEntries(lines.map((entry) => {
    let [key, val] = entry.split("=");
    const quoteRegex = /^(['"])(.*)(\1)$/;

    if (quoteRegex.test(val)) {
      val = val.replace(quoteRegex, "$2");
    } else {
      val = val.trim();
    }

    return [key.trim(), val];
  }));
}

export async function readFile(
  path: string,
  ignoreMissingFile: boolean,
): Promise<string | undefined> {
  let file;

  try {
    file = await Deno.readFile(path);
  } catch (e) {
    if (ignoreMissingFile && e instanceof Deno.errors.NotFound) return;
    throw e;
  }

  const decoder = new TextDecoder();
  return decoder.decode(file);
}

export async function load({
  path = ".env",
  priorityEnv = false,
  ignoreMissingFile = false,
  verifyAgainstExample,
}: LoadOptions) {
  const fileText = await readFile(path, ignoreMissingFile);

  if (fileText === undefined) return;

  const dotEnvs = parse(fileText);

  for (const [key, val] of Object.entries(dotEnvs)) {
    if (priorityEnv && Deno.env.get(key) !== undefined) {
      continue;
    }

    Deno.env.set(key, val);
  }

  if (verifyAgainstExample !== undefined) {
    if (typeof verifyAgainstExample !== "string") {
      verifyAgainstExample = ".env.example";
    }

    const fileTextExample = await readFile(verifyAgainstExample, false);
    const dotEnvsExample = parse(fileTextExample as string);

    for (const key of Object.keys(dotEnvsExample)) {
      if (!Deno.env.get(key)) {
        throw new MissingEnv(
          `Environment variable '${key}' is missing from environment, but is set in example file '${verifyAgainstExample}'`,
        );
      }
    }
  }
}
