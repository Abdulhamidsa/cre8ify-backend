import bcrypt from 'bcrypt';

import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { getErrorMessage } from '../../common/utils/error.utils';
import { generateAccessToken, generateRefreshToken } from '../../common/utils/jwt';
import Logger from '../../common/utils/logger';
import { ApiResponse, createResponse } from '../../common/utils/response.handler';
import { SQL_QUERIES } from '../../common/utils/sql.constants';

export const signInUser = async <T extends { email: string; password: string }>(
  data: T,
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
  const { email, password } = data;
  const sqlClient = await getSQLClient();
  try {
    const result = await sqlClient.query(SQL_QUERIES.getUserLogin, [email]);
    const user = result.rows[0];
    if (!user) {
      throw new AppError('Invalid email or password', 400);
    }
    const { mongo_ref, password_hash } = user;

    const isPasswordValid = await bcrypt.compare(password, password_hash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 400);
    }
    const accessToken = generateAccessToken({ mongo_ref });
    const refreshToken = generateRefreshToken({ mongo_ref });

    return createResponse(true, { accessToken, refreshToken });
  } catch (error) {
    Logger.error(getErrorMessage(error));
    const message = error instanceof AppError ? error.message : 'Signin failed';
    throw new AppError(message, error instanceof AppError ? error.status : 500);
  } finally {
    sqlClient.release();
  }
};
