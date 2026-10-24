import { execFile } from 'node:child_process';
import { watch } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const root = resolve(projectRoot, process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4174);
const watchMode = process.argv.includes('--watch');
const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

// In watch mode, every page gets this snippet so it reloads after a rebuild.
const reloadSnippet = "<script>new EventSource('/__reload').onmessage = () => location.reload();</script>";
const reloadClients = new Set();

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);

  if (watchMode && pathname === '/__reload') {
    response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    reloadClients.add(response);
    request.on('close', () => reloadClients.delete(response));
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    let body = await readFile(filePath);
    if (watchMode && extname(filePath) === '.html') {
      body = body.toString().replace(/<\/body>/i, `${reloadSnippet}\n</body>`);
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`DARA site server listening on http://127.0.0.1:${port}`);
  if (watchMode) console.log('Watching for changes. Pages reload automatically after each rebuild.');
});

if (watchMode) {
  const ignored = /^(dist|node_modules|\.git|tests|test-results|scripts)([\\/]|$)/;
  let timer;
  let building = false;
  let pending = false;

  function rebuild() {
    if (building) {
      pending = true;
      return;
    }
    building = true;
    execFile(process.execPath, [join(projectRoot, 'scripts', 'build.mjs')], (error, stdout, stderr) => {
      building = false;
      if (error) {
        console.error(`Build failed:\n${stderr || error.message}`);
      } else {
        console.log(`Rebuilt at ${new Date().toLocaleTimeString()}`);
        for (const client of reloadClients) client.write('data: reload\n\n');
      }
      if (pending) {
        pending = false;
        rebuild();
      }
    });
  }

  watch(projectRoot, { recursive: true }, (event, filename) => {
    if (!filename || ignored.test(filename)) return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}
