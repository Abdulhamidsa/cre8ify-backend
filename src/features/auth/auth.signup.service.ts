import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { hashPassword } from '../../common/utils/helpers';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { UserProfile } from '../user/models/user.model';

export const signUpUserService = async (data: { email: string; password: string }): Promise<void> => {
  const { email, password } = data;
  const sqlClient = await getSQLClient();

  try {
    // Begin transaction
    await sqlClient.query('BEGIN');

    // Check if the user already exists in SQL
    const existingUser = await sqlClient.query(SQL_QUERIES.checkUserExists, [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError('Email already exists', 409);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate mongo_ref
    const mongo_ref = `user_${Date.now()}`;

    // Save user in SQL
    const result = await sqlClient.query(SQL_QUERIES.insertUser, [email, hashedPassword, mongo_ref]);
    if (result.rowCount === 0) {
      throw new AppError('Failed to insert user into SQL', 500);
    }

    // Save user profile in MongoDB
    const mongoUserProfile = await UserProfile.create({ mongo_ref });
    if (!mongoUserProfile) {
      throw new AppError('Failed to create user profile in MongoDB', 500);
    }

    // Commit transaction
    await sqlClient.query('COMMIT');
  } catch (error) {
    await sqlClient.query('ROLLBACK');
    throw error;
  } finally {
    sqlClient.release();
  }
};
