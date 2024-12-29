import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { generateFriendlyId } from '../../common/utils/helper';
import { generateMongoRef, hashPassword } from '../../common/utils/helpers';
import Logger from '../../common/utils/logger';
import { saveDocument } from '../../common/utils/mongo.service';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { SignUpInput } from '../../common/validation/user.validation';
import { User } from '../user/models/user.model';

export const signUpUserService = async (data: SignUpInput): Promise<void> => {
  const { username, password } = data;
  const sqlClient = await getSQLClient();

  try {
    // Begin MySQL transaction
    await sqlClient.query('BEGIN');

    // Check if the user already exists in MySQL
    const existingUser = await sqlClient.query(SQL_QUERIES.checkUserExists, [username]);
    if (existingUser.rows.length > 0) {
      throw new AppError('Email already exists', 409);
    }

    // Hash the password and generate a unique Mongo reference
    const hashedPassword = await hashPassword(password);
    const mongoRef = generateMongoRef();
    const friendlyId = generateFriendlyId(username);

    // Insert the user into MySQL
    const sqlResult = await sqlClient.query(SQL_QUERIES.insertUser, [username, hashedPassword, mongoRef]);
    if (sqlResult.rowCount === 0) {
      throw new AppError('Failed to insert user into MySQL', 500);
    }

    // Save additional user details in MongoDB
    const mongoUser = await saveDocument(User, {
      mongoRef: mongoRef,
      friendlyId: friendlyId,
    });

    if (!mongoUser) {
      throw new AppError('Failed to create user in MongoDB', 500);
    }

    // Commit MySQL transaction after MongoDB succeeds
    await sqlClient.query('COMMIT');

    Logger.info(`User successfully created with mongo_ref: ${mongoRef}`);
  } catch (error) {
    // Rollback MySQL transaction on any error
    await sqlClient.query('ROLLBACK');
    Logger.error('Error during user signup', error);
    throw error;
  } finally {
    sqlClient.release();
  }
};
