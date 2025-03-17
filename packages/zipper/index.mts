import { resolve } from 'node:path';
import { zipBundle } from './lib/index.js';
import { IS_FIREFOX } from '@extension/env';

import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(resolve(import.meta.dirname, '..', '..', '..', 'package.json'), 'utf8'));

const fileName = packageJson.name;
const version = packageJson.version;

await zipBundle({
  distDirectory: resolve(import.meta.dirname, '..', '..', '..', 'dist'),
  buildDirectory: resolve(import.meta.dirname, '..', '..', '..', 'dist-zip'),
  archiveName: IS_FIREFOX ? `${fileName}.xpi` : `${fileName}@${version}.zip`,
});
