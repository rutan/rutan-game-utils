import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { defineConfig } from '@rutan/deployment-zip';
import { insertTagToHTMLHeadPlugin } from '@rutan/deployment-zip/plugins/insertTagToHTMLHeadPlugin';

const execFileAsync = promisify(execFile);
const consumer = fileURLToPath(new URL('.', import.meta.url));

test('the installed package exposes its config helper and plugin subpath', () => {
  const plugin = insertTagToHTMLHeadPlugin({ append: [{ tag: 'meta', attributes: { name: 'packed-test' } }] });
  const config = defineConfig({ plugins: [plugin] });
  assert.equal(config.plugins[0], plugin);
  assert.equal(typeof plugin.transform, 'function');
});

test('the installed CLI loads a consumer config and copies a file', async () => {
  // Keep the config inside the consumer so its package imports resolve from the installation.
  const directory = await mkdtemp(join(consumer, 'cli-'));
  try {
    const input = join(directory, 'input');
    const output = join(directory, 'output');
    const config = join(directory, 'deployment-zip.mjs');
    await mkdir(input);
    await writeFile(join(input, 'example.txt'), 'packed package test\n');
    await writeFile(
      config,
      `import { defineConfig } from '@rutan/deployment-zip';\nexport default defineConfig(${JSON.stringify({ copy: { outDir: output } })});\n`,
    );

    await execFileAsync(
      join(consumer, 'node_modules', '.bin', 'deployment-zip'),
      [input, '--config', config, '--mode', 'copy'],
      { cwd: consumer, timeout: 30_000 },
    );
    assert.equal(await readFile(join(output, 'example.txt'), 'utf8'), 'packed package test\n');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
