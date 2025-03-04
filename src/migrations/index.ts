import * as migration_20250206_130617 from './20250206_130617';
import * as migration_20250304_160622 from './20250304_160622';
import * as migration_20250304_171531 from './20250304_171531';

export const migrations = [
  {
    up: migration_20250206_130617.up,
    down: migration_20250206_130617.down,
    name: '20250206_130617',
  },
  {
    up: migration_20250304_160622.up,
    down: migration_20250304_160622.down,
    name: '20250304_160622',
  },
  {
    up: migration_20250304_171531.up,
    down: migration_20250304_171531.down,
    name: '20250304_171531'
  },
];
