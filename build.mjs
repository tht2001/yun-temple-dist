import { copyFile, cp, mkdir, rm } from 'node:fs/promises';

const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'main.js', 'state.js', 'style.css']) {
  await copyFile(new URL(name, import.meta.url), new URL(name, output));
}
await cp(new URL('./vendor/', import.meta.url), new URL('vendor/', output), { recursive: true });
console.log('Built site in app/dist');
