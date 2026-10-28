import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import {playwright} from '@vitest/browser-playwright';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {mergeConfig} from 'vite';
import {configDefaults, defineConfig} from 'vitest/config';
import viteConfig from './vite.config.ts';

const rootDirectory = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
    viteConfig,
    defineConfig({
      test: {
        projects: [
          {
            extends: true,
            test: {
              environment: 'jsdom',
              exclude: [...configDefaults.exclude, '**/*.jest.test.ts'],
              name: 'unit',
              setupFiles: ['./vitest.setup.ts'],
            },
          },
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: join(rootDirectory, '.storybook'),
              }),
            ],
            test: {
              browser: {
                enabled: true,
                headless: true,
                instances: [{browser: 'chromium'}],
                provider: playwright({}),
              },
              name: 'storybook',
              setupFiles: ['./.storybook/vitest.setup.ts'],
            },
          },
        ],
      },
    }),
);
