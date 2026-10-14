import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const sharedFooter = await readFile(join(root, 'footer.html'), 'utf8');
const features = JSON.parse(await readFile(join(root, 'features.json'), 'utf8'));
const disabledFeatures = Object.keys(features).filter((name) => features[name] === false);
const disabledPages = disabledFeatures.map((name) => `${name}.html`);
const entries = await readdir(root, { withFileTypes: true });

// A disabled feature's page is left out of the build, and every link marked
// data-feature="<name>" is removed from the pages that remain.
function removeDisabledLinks(page) {
  return disabledFeatures.reduce((html, name) => html.replace(
    new RegExp(`[ \\t]*<a\\b[^>]*\\bdata-feature="${name}"[^>]*>[\\s\\S]*?</a>[ \\t]*\\r?\\n?`, 'gi'),
    ''
  ), page);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of entries) {
  if (entry.isDirectory() && ['fonts', 'images', 'videos'].includes(entry.name)) {
    await cp(join(root, entry.name), join(output, entry.name), { recursive: true });
    continue;
  }

  if (entry.isFile() && extname(entry.name) === '.html') {
    if (entry.name === 'footer.html' || disabledPages.includes(entry.name)) continue;
    const source = await readFile(join(root, entry.name), 'utf8');
    const page = removeDisabledLinks(source.replace(/<footer\b[\s\S]*?<\/footer>/gi, sharedFooter.trimEnd()));
    if (!/<footer\b/i.test(source)) {
      throw new Error(`Expected a footer in ${entry.name}`);
    }
    if ((page.match(/<footer\b/gi) || []).length !== 1) {
      throw new Error(`Expected exactly one rendered footer in ${entry.name}`);
    }
    await writeFile(join(output, entry.name), page);
    continue;
  }

  if (entry.isFile() && ['.css', '.js'].includes(extname(entry.name))) {
    await cp(join(root, entry.name), join(output, entry.name));
    continue;
  }

  if (entry.isFile() && entry.name === 'CNAME') {
    await cp(join(root, entry.name), join(output, entry.name));
  }
}

console.log(`Built static site in ${resolve(output)}`);
