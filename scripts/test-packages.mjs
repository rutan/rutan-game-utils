import { execFile, spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);
const packages = ['frame-tween', 'mini-random', 'deployment-zip'];
const typeScriptVersion = require('typescript/package.json').version;
const nodeTypesVersion = require('@types/node/package.json').version;
const installOptions = ['--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false'];

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      timeout: 180_000,
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed (${signal ?? code}) in ${cwd}`));
    });
  });
}

const temporaryRoot = await mkdtemp(join(tmpdir(), 'rutan-packed-'));
try {
  const tarballs = join(temporaryRoot, 'tarballs');
  await mkdir(tarballs);

  for (const name of packages) {
    console.log(`\n[${name}] Packing built package`);
    const { stdout } = await execFileAsync('npm', ['pack', '--json', '--pack-destination', tarballs], {
      cwd: join(root, 'packages', name),
      timeout: 180_000,
    });
    const [{ filename }] = JSON.parse(stdout);
    const consumer = join(temporaryRoot, name);
    await cp(join(root, 'tests', 'packed', name), consumer, { recursive: true });
    await writeFile(
      join(consumer, 'package.json'),
      JSON.stringify({ name: `packed-test-${name}`, private: true, type: 'module' }),
    );

    // Run before installing test tooling so it cannot supply missing runtime dependencies.
    console.log(`[${name}] Installing tarball and checking runtime`);
    await run('npm', ['install', ...installOptions, join(tarballs, filename)], consumer);
    await run(process.execPath, ['--test', 'runtime.test.mjs'], consumer);

    console.log(`[${name}] Installing type-check tooling`);
    const typeDependencies = [`typescript@${typeScriptVersion}`];
    if (name === 'deployment-zip') typeDependencies.push(`@types/node@${nodeTypesVersion}`);
    await run('npm', ['install', ...installOptions, '--save-dev', '--include=dev', ...typeDependencies], consumer);

    const compilerPackage = JSON.parse(
      await readFile(join(consumer, 'node_modules', 'typescript', 'package.json'), 'utf8'),
    );
    const compiler = join(consumer, 'node_modules', 'typescript', compilerPackage.bin.tsc);
    for (const resolution of ['NodeNext', 'Bundler']) {
      console.log(`[${name}] Checking types (${resolution})`);
      await writeFile(
        join(consumer, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            lib: ['ES2022'],
            module: resolution === 'NodeNext' ? 'NodeNext' : 'ESNext',
            moduleResolution: resolution,
            strict: true,
            noEmit: true,
            skipLibCheck: false,
            types: name === 'deployment-zip' ? ['node'] : [],
          },
          include: ['types.ts'],
        }),
      );
      await run(process.execPath, [compiler, '--project', 'tsconfig.json'], consumer);
    }
  }

  console.log('\nAll packed package checks passed.');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
