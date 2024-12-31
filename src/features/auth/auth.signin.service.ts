import bcrypt from 'bcrypt';

import { ensureTablesExist, getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { SignInResponse } from '../../common/types/user.types';
import { generateTokens } from '../../common/utils/jwt';
import Logger from '../../common/utils/logger';
import { ApiResponse, createResponse } from '../../common/utils/response.handler';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { withTransaction } from '../../common/utils/transaction.helper';
import { SignInInput } from '../../common/validation/user.validation';
import { User } from '../../models/user.model';

export const signInUser = async (data: SignInInput): Promise<ApiResponse<SignInResponse>> => {
  const { email, password } = data;
  const sqlClient = await getSQLClient();

  try {
    let mongoRef = '';
    let friendlyId = '';

    // Ensure the necessary tables exist
    await ensureTablesExist();

    // Log the sign-in attempt
    Logger.info(`Sign-in attempt for email: ${email}`);

    // Use the transaction utility for SQL operations
    await withTransaction(sqlClient, async () => {
      // Verify the user in PostgreSQL
      const result = await sqlClient.query(SQL_QUERIES.getUserLogin, [email]);
      const user = result.rows[0];
      if (!user) {
        // Use a generic error message to avoid exposing details
        throw new AppError('Invalid email or password', 400);
      }

      const { password_hash, mongo_ref } = user;
      mongoRef = mongo_ref;

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, password_hash);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 400);
      }
    });

    // Validate user existence in MongoDB
    const mongoUser = await User.findOne({ mongoRef });
    if (!mongoUser) {
      Logger.error(`MongoDB user not found for mongoRef: ${mongoRef}`);
      throw new AppError('Authentication failed', 500); // Secure error message
    }

    // Extract friendlyId from MongoDB user
    friendlyId = mongoUser.friendlyId;

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateTokens(mongoRef, friendlyId);

    Logger.info(`User with mongoRef ${mongoRef} signed in successfully`);

    return createResponse(true, { mongo_ref: mongoRef, friendlyId, accessToken, refreshToken });
  } catch (error) {
    Logger.error(`Error during user sign-in for email: ${email}, Error: ${(error as Error).message}`);
    throw error;
  } finally {
    sqlClient.release();
  }
};
