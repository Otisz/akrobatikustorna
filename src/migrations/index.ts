import * as migration_20250504_110505 from './20250504_110505';

export const migrations = [
  {
    up: migration_20250504_110505.up,
    down: migration_20250504_110505.down,
    name: '20250504_110505'
  },
];
