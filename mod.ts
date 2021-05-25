interface LoadOptions {
  /** The path of the env file */
  path?: string;
  /** If true, won't overwrite existing variables */
  priorityEnv?: boolean;
  /** Will not throw an error if file is not found */
  ignoreMissingFile?: boolean;
}

export function parse(string: string) {
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
export async function load({
  path = ".env",
  priorityEnv = false,
  ignoreMissingFile = false,
}: LoadOptions) {
  let file;

  try {
    file = await Deno.readFile(path);
  } catch (e) {
    if (ignoreMissingFile) return;
    throw e;
  }

  const decoder = new TextDecoder();
  const dotEnvs = parse(decoder.decode(file));

  for (const [key, val] of Object.entries(dotEnvs)) {
    if (priorityEnv && Deno.env.get(key) !== undefined) {
      continue;
    }

    Deno.env.set(key, val);
  }
}
