// import { Pool } from "pg";
// import { SECRETS } from "./config";
// import { AppError } from "../errors/app.error";
// import { getErrorMessage } from "../utils/error.utils";

// const pool = new Pool({
//   connectionString: SECRETS.postgresConnectionString,

//   ssl: {
//     rejectUnauthorized: false, // Required for some hosted services like Railway
//   },
// });

// export const connectPostgres = async (): Promise<void> => {
//   try {
//     await pool.connect();
//     console.log("Connected to PostgreSQL successfully!");
//   } catch (error) {
//     new AppError(getErrorMessage(error), 500);
//   }
// };

// export default pool;
import { Pool, PoolClient } from "pg";
import { SECRETS } from "./config";
import { AppError } from "../errors/app.error";
import { getErrorMessage } from "../utils/error.utils";

// Create a pool but do not connect at startup
const pool = new Pool({
  connectionString: SECRETS.postgresConnectionString,
  ssl: { rejectUnauthorized: false },
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
