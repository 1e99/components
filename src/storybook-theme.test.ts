import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

describe('Storybook theme', () => {
  it('loads the official Inter font for header previews', () => {
    const stylesheet = readFileSync(resolve(process.cwd(), '.storybook/preview.css'), 'utf8');

    expect(stylesheet).toContain('font-family: "Inter"');
    expect(stylesheet).toContain('./public/fonts/Inter-Variable.ttf');
    expect(stylesheet).toContain('font-family: var(--font-body)');
  });
});
