import { Pool, PoolClient } from 'pg';

import { AppError } from '../errors/app.error';
import { getErrorMessage } from '../utils/error.utils';
import Logger from '../utils/logger';
import { SQL_QUERIES } from '../utils/sql.constants';
import { SECRETS } from './config';

// SSL Configuration based on environment
const sslConfig = SECRETS.nodeEnv === 'production' ? { rejectUnauthorized: true } : false;

// Create the pool instance
const pool = new Pool({
  connectionString: SECRETS.postgresConnectionString,
  ssl: sslConfig,
});

// Function to get a client on demand
export const getSQLClient = async (): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    throw new AppError(getErrorMessage(error), 500);
  }
};

// Function to check and create tables if they don't exist
export const ensureTablesExist = async (): Promise<void> => {
  const sqlClient = await getSQLClient();

  const tableQueries = [SQL_QUERIES.createUsersTable];

  try {
    Logger.info('Ensuring database tables exist...');
    for (const query of tableQueries) {
      await sqlClient.query(query);
    }
    Logger.info('All necessary tables are ensured.');
  } catch (error) {
    Logger.error('Error ensuring tables exist:', error);
    throw new AppError('Database initialization failed', 500);
  } finally {
    sqlClient.release();
  }
};

// Health check function for PostgreSQL
export const checkPostgresHealth = async (): Promise<void> => {
  try {
    const client = await getSQLClient();
    await client.query('SELECT NOW()');
    client.release();
  } catch (error) {
    throw new AppError(getErrorMessage(error), 500);
  }
};

export default pool;
