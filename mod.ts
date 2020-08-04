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

export async function load(path: string = ".env") {
  const file = await Deno.readFile(path);
  const decoder = new TextDecoder();
  const dotEnvs = parse(decoder.decode(file));

  for (const [key, val] of Object.entries(dotEnvs)) {
    Deno.env.set(key, val);
  }
}
