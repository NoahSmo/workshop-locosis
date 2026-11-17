import * as migration_20261116_231633_initial from './20261116_231633_initial';
import * as migration_20261117_175552_costume_disponibilite_email_client from './20261117_175552_costume_disponibilite_email_client';
import * as migration_20261117_175557_suppression_consentement from './20261117_175557_suppression_consentement';

export const migrations = [
  {
    up: migration_20261116_231633_initial.up,
    down: migration_20261116_231633_initial.down,
    name: '20261116_231633_initial',
  },
  {
    up: migration_20261117_175552_costume_disponibilite_email_client.up,
    down: migration_20261117_175552_costume_disponibilite_email_client.down,
    name: '20261117_175552_costume_disponibilite_email_client',
  },
  {
    up: migration_20261117_175557_suppression_consentement.up,
    down: migration_20261117_175557_suppression_consentement.down,
    name: '20261117_175557_suppression_consentement'
  },
];
