import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { generateFriendlyId } from '../../common/utils/helper';
import { generateMongoRef, hashPassword } from '../../common/utils/helpers';
import Logger from '../../common/utils/logger';
import { saveDocument } from '../../common/utils/mongo.service';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { SignUpInput } from '../../common/validation/user.zod';
import { User } from '../../models/user.model';

export const signUpUserService = async (data: SignUpInput): Promise<void> => {
  const { email, password, username, age, bio, profilePicture, countryOrigin, profession, coverImage } = data;
  const sqlClient = await getSQLClient();

  try {
    await sqlClient.query(SQL_QUERIES.createUsersTable);

    // Begin transaction
    await sqlClient.query('BEGIN');

    const existingUser = await sqlClient.query(SQL_QUERIES.checkEmailexist, [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError('Email already exists', 409, { email });
    }

    const hashedPassword = await hashPassword(password);
    const mongoRef = generateMongoRef();
    const friendlyId = generateFriendlyId(username || '');

    const sqlResult = await sqlClient.query(SQL_QUERIES.insertUser, [email, hashedPassword, mongoRef]);
    if (sqlResult.rowCount === 0) {
      throw new AppError('Failed to insert user into MySQL', 500);
    }

    const mongoUser = await saveDocument(User, {
      mongoRef,
      friendlyId,
      username,
      age,
      bio,
      profilePicture,
      coverImage,
      countryOrigin,
      profession,
    });

    if (!mongoUser) {
      throw new AppError('Failed to create user in MongoDB', 500);
    }

    await sqlClient.query('COMMIT');
    Logger.info(`User successfully created with mongo_ref: ${mongoRef}`);
  } catch (error) {
    await sqlClient.query('ROLLBACK');
    Logger.error('Error during user signup', error);
    throw error;
  } finally {
    sqlClient.release();
  }
};
