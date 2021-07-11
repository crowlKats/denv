interface LoadOptions {
  /** The path of the env file, defaults to ".env" */
  path?: string;
  /** If true, won't overwrite existing variables */
  priorityEnv?: boolean;
  /** Will not throw an error if file is not found */
  ignoreMissingFile?: boolean;
  /** If true, will verify the final environment against the example file */
  verifyAgainstExample?: boolean;
  /** If true, will fallback to the example file */
  defaultToExample?: boolean;
  /** Path to example file, defaults to ".env.example" */
  exampleFile?: string;
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

/** Loads an env file into Deno.env.
 *
 * Returns true if the operation was successfull, or throws an error or
 * returns a boolean if the import was not successfull depending on the options
 *
 *
 *      await load() // uses default options
 *
 *      await load({ // same as above
 *        path = ".env",
 *        priorityEnv = false,
 *        ignoreMissingFile = false,
 *        verifyAgainstExample = false,
 *        defaultToExample = false,
 *        verifyAgainstExample = exampleFile,
 *      })
 */
export async function load({
  path = ".env",
  priorityEnv = false,
  ignoreMissingFile = false,
  verifyAgainstExample = false,
  defaultToExample = false,
  exampleFile = ".env.example",
}: LoadOptions = {}): Promise<boolean> {
  // Will ignore missing file if either defaultToExample or ignoreMissingFile as they provide the same outcome
  let fileText = await readFile(path, ignoreMissingFile || defaultToExample);

  if (fileText === undefined) {
    if (defaultToExample) {
      // Will throw if default example file was not found and ignoreMissingFile is not true
      fileText = await readFile(exampleFile, ignoreMissingFile);

      if (fileText === undefined) return false;
    } else {
      return false;
    }
  }

  const dotEnvs = parse(fileText);

  // Sets the envs with data from file
  for (const [key, val] of Object.entries(dotEnvs)) {
    if (priorityEnv && Deno.env.get(key) !== undefined) {
      continue;
    }

    Deno.env.set(key, val);
  }

  // Verifies against the example file, will throw if example file is not found or missing env
  if (verifyAgainstExample) {
    const fileTextExample = await readFile(exampleFile, false);
    const dotEnvsExample = parse(fileTextExample as string);

    for (const key of Object.keys(dotEnvsExample)) {
      if (!Deno.env.get(key)) {
        throw new MissingEnv(
          `Environment variable '${key}' is missing from environment, but is set in example file '${exampleFile}'`,
        );
      }
    }
  }

  return true;
}
