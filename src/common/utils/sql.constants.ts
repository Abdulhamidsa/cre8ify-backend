export const SQL_QUERIES = {
  checkUserExists: "SELECT id FROM users WHERE email = $1;",
  insertUser: `
    INSERT INTO users (email, password_hash, mongo_ref)
    VALUES ($1, $2, $3) RETURNING id;
  `,
  rollbackUser: "DELETE FROM users WHERE id = $1;",
};
