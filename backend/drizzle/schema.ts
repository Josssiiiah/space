import {
  sqliteTable,
  AnySQLiteColumn,
  uniqueIndex,
  integer,
  text,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable(
  'users',
  {
    id: integer().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  },
  (table) => [uniqueIndex('users_email_unique').on(table.email)],
);
