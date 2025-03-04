import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`documents_updated_at_idx\` ON \`documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`documents_created_at_idx\` ON \`documents\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`documents_filename_idx\` ON \`documents\` (\`filename\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`prefix\` text DEFAULT 'media';`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_url\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_width\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_height\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_mime_type\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filesize\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`sizes_thumbnail_filename\` text;`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`documents_id\` integer REFERENCES documents(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_documents_id_idx\` ON \`payload_locked_documents_rels\` (\`documents_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`documents\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`posts_id\` integer,
  	\`payload_jobs_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`payload_jobs_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "payload_jobs_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "payload_jobs_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_payload_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`payload_jobs_id\`);`)
  await db.run(sql`DROP INDEX IF EXISTS \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_url\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_width\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_height\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_mime_type\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filesize\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`sizes_thumbnail_filename\`;`)
}
