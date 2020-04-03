export function parse(string: string) {
	const lines = string.split(/\n|\r|\r\n/).filter(line => {
		if (line.startsWith("#")) {
			return false;
		} else {
			return Boolean(line);
		}
	});
	
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
	
	for (const [key, val] of dotEnvs.entries()) {
		Deno.env()[key] = val;
	}
}


await load();
