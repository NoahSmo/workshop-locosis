import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" ALTER COLUMN "consent" DROP DEFAULT;
  ALTER TABLE "inquiries" ADD COLUMN "client_email" varchar;
  ALTER TABLE "costume_items" ADD COLUMN "available_from" timestamp(3) with time zone;`)
  // Demandes existantes : reprend l'email de la fiche client.
  await db.execute(sql`
   UPDATE "inquiries" SET "client_email" = "clients"."email" FROM "clients" WHERE "inquiries"."client_id" = "clients"."id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inquiries" ALTER COLUMN "consent" SET DEFAULT false;
  ALTER TABLE "inquiries" DROP COLUMN "client_email";
  ALTER TABLE "costume_items" DROP COLUMN "available_from";`)
}
