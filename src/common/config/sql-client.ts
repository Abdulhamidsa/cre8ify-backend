import { Pool, PoolClient } from 'pg';

import { AppError } from '../errors/app.error';
import { getErrorMessage } from '../utils/error.utils';
import { SECRETS } from './config';

// SSL Configuration based on environment
const sslConfig = SECRETS.nodeEnv === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false };

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

// Health check function for PostgreSQL
export const checkPostgresHealth = async (): Promise<void> => {
  try {
    const client = await getSQLClient();
    await client.query('SELECT 1');
    client.release();
    console.log('PostgreSQL connection is healthy');
  } catch (error) {
    console.error('PostgreSQL health check failed:', getErrorMessage(error));
    throw new AppError('PostgreSQL health check failed', 500);
  }
};

export default pool;
