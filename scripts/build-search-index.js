const fs = require("fs");
const path = require("path");

const totalHtmlFiles = 152;
const rootDir = path.join(__dirname, "..");
const htmlDir = path.join(rootDir, "publication-web-resources", "html");
const outDir = path.join(rootDir, "publication-web-resources", "search");
const outFile = path.join(outDir, "index.json");

function getHtmlFileName(index) {
	if (index === 0) {
		return "publication.html";
	}
	return "publication-" + index + ".html";
}

function decodeEntities(text) {
	const map = {
		"&nbsp;": " ",
		"&amp;": "&",
		"&lt;": "<",
		"&gt;": ">",
		"&quot;": "\"",
		"&#39;": "'"
	};
	return text
		.replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => map[match])
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripHtml(html) {
	const withoutScripts = html
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ");
	const withoutTags = withoutScripts.replace(/<[^>]+>/g, " ");
	const decoded = decodeEntities(withoutTags);
	return decoded.replace(/\s+/g, " ").trim();
}

function ensureOutDir() {
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}
}

function buildIndex() {
	const entries = [];
	for (let i = 0; i < totalHtmlFiles; i += 1) {
		const fileName = getHtmlFileName(i);
		const filePath = path.join(htmlDir, fileName);
		if (!fs.existsSync(filePath)) {
			continue;
		}
		const html = fs.readFileSync(filePath, "utf8");
		const rawText = stripHtml(html);
		entries.push({
			fileIndex: i,
			pageNumber: i * 2,
			rawText: rawText,
			text: rawText.toLowerCase()
		});
	}
	return entries;
}

ensureOutDir();
const index = buildIndex();
fs.writeFileSync(outFile, JSON.stringify(index));
console.log("Search index written to", outFile);
