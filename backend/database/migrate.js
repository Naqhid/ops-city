/**
 * Safe migration runner for CityOps.
 * It only executes explicitly supplied, numbered .sql files from migrations/.
 * No migration is executed automatically at server startup.
 * Review and back up the database before running this command.
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(here, 'migrations');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  multipleStatements: true,
});
try {
  await connection.query('CREATE TABLE IF NOT EXISTS `migration_history` (\n    `name` VARCHAR(255) NOT NULL PRIMARY KEY,\n    `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n  )');
  const files = (await fs.readdir(dir)).filter(n => /^\d+.*\.sql$/i.test(n)).sort();
  if (!files.length) {
    console.log('No numbered SQL migrations found. Existing database left unchanged.');
  }
  for (const name of files) {
    const [rows] = await connection.execute('SELECT name FROM migration_history WHERE name = ?', [name]);
    if (rows.length) { console.log(`Skip already applied: ${name}`); continue; }
    const sql = await fs.readFile(path.join(dir, name), 'utf8');
    console.log(`Applying ${name}...`);
    await connection.beginTransaction();
    try {
      // MySQL DDL may auto-commit; the history row is still only recorded after success.
      await connection.query(sql);
      await connection.execute('INSERT INTO migration_history (name) VALUES (?)', [name]);
      await connection.commit();
      console.log(`Applied ${name}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
} finally {
  await connection.end();
}
