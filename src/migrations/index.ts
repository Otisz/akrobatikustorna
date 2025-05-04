import * as migration_20250504_112317 from './20250504_112317';

export const migrations = [
  {
    up: migration_20250504_112317.up,
    down: migration_20250504_112317.down,
    name: '20250504_112317'
  },
];
