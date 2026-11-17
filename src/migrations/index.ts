import * as migration_20261116_231633_initial from './20261116_231633_initial';

export const migrations = [
  {
    up: migration_20261116_231633_initial.up,
    down: migration_20261116_231633_initial.down,
    name: '20261116_231633_initial'
  },
];
