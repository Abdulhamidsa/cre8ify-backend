export const SQL_QUERIES = {
  checkUserExists: 'SELECT id FROM users WHERE username = $1;',
  insertUser: `
    INSERT INTO users (username, password_hash, mongo_ref)
    VALUES ($1, $2, $3) RETURNING id;
  `,
  rollbackUser: 'DELETE FROM users WHERE id = $1;',
  getUserLogin: 'SELECT password_hash, mongo_ref FROM users WHERE username = $1;',
  deleteUser: 'DELETE FROM users WHERE mongo_ref = $1;',

  createUsersTable: `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      mongo_ref VARCHAR(100) UNIQUE NOT NULL
    );
  `,
};
