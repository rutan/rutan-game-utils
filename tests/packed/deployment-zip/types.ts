import { defineConfig, type Config, type Plugin } from '@rutan/deployment-zip';
import { insertTagToHTMLHeadPlugin } from '@rutan/deployment-zip/plugins/insertTagToHTMLHeadPlugin';

export const plugin: Plugin = insertTagToHTMLHeadPlugin({
  targetModes: ['copy'],
  append: [{ tag: 'meta', attributes: { name: 'packed-test' } }],
});
export const config: Partial<Config> = defineConfig({ copy: { outDir: 'output' }, plugins: [plugin] });

// @ts-expect-error The output directory must be a string or a function.
defineConfig({ copy: { outDir: 123 } });
// @ts-expect-error The plugin return value cannot be assigned to a string.
export const invalidPlugin: string = insertTagToHTMLHeadPlugin({});
