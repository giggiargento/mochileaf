import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exportRoot } from './load';

export function writeExport(filename: string, content: string): string {
  mkdirSync(exportRoot, { recursive: true });
  const path = join(exportRoot, filename);
  writeFileSync(path, content, 'utf8');
  return path;
}
