export function parse(string: string) {
	const lines = string.split(/\n|\r|\r\n/).filter(line => line.startsWith("#") ? false : !!line);
	
	return Object.fromEntries(lines.map(entry => {
		let [key, val] = entry.split("=");
		const quoteRegex = /^['"](.*)['"]$/;
		
		if (quoteRegex.test(val)) {
			val = val.replace(quoteRegex, "$1");
		} else {
			val = val.trim();
		}
		
		return [key, val];
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


await load();
