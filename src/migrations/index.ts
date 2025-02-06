import * as migration_20250206_130617 from './20250206_130617';

export const migrations = [
  {
    up: migration_20250206_130617.up,
    down: migration_20250206_130617.down,
    name: '20250206_130617'
  },
];
