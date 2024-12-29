import bcrypt from 'bcrypt';

import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { SignInResponse } from '../../common/types/user.types';
import { generateTokens } from '../../common/utils/jwt';
import Logger from '../../common/utils/logger';
import { ApiResponse, createResponse } from '../../common/utils/response.handler';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { withTransaction } from '../../common/utils/transaction.helper';
import { SignInInput } from '../../common/validation/user.validation';
import { User } from '../user/models/user.model';

export const signInUser = async (data: SignInInput): Promise<ApiResponse<SignInResponse>> => {
  const { username, password } = data;
  const sqlClient = await getSQLClient();

  try {
    let mongoRef: string = '';
    let friendlyId: string = '';

    // Use the transaction utility for SQL operations
    await withTransaction(sqlClient, async () => {
      // Verify the user in MySQL
      const result = await sqlClient.query(SQL_QUERIES.getUserLogin, [username]);
      const user = result.rows[0];
      if (!user) {
        throw new AppError('Invalid username or password', 400);
      }

      const { password_hash, mongo_ref } = user;
      mongoRef = mongo_ref;

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, password_hash);
      if (!isPasswordValid) {
        throw new AppError('Invalid username or password', 400);
      }
    });

    // Validate user existence in MongoDB
    const mongoUser = await User.findOne({ mongo_ref: mongoRef });
    if (!mongoUser) {
      throw new AppError('User not found in MongoDB', 500);
    }

    // Extract friendlyId from MongoDB user
    friendlyId = mongoUser.friendlyId;

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(mongoRef, friendlyId);

    Logger.info(`User with mongo_ref ${mongoRef} signed in successfully`);
    return createResponse(true, { mongo_ref: mongoRef, friendlyId, accessToken, refreshToken });
  } catch (error) {
    Logger.error(`Error during user sign-in: ${(error as Error).message}`);
    throw error;
  } finally {
    sqlClient.release();
  }
};
