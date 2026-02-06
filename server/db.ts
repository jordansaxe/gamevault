import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@shared/schema';

// Create database connection only if DATABASE_URL is available
export function createDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = createDb();
export type Database = NonNullable<ReturnType<typeof createDb>>;
