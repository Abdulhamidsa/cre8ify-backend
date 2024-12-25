import { getSQLClient } from '../../common/config/sql-client';
import { AppError } from '../../common/errors/app.error';
import { generateMongoRef, hashPassword } from '../../common/utils/helpers';
import { saveDocument } from '../../common/utils/mongo.service';
import { SQL_QUERIES } from '../../common/utils/sql.constants';
import { SignUpInput } from '../../common/validation/user.validation';
import Users from '../user/models/user.model';

export const signUpUserService = async (data: SignUpInput): Promise<void> => {
  const { email, password, name, age } = data;
  const sqlClient = await getSQLClient();
  try {
    const existingUser = await sqlClient.query(SQL_QUERIES.checkUserExists, [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError('Email already exists', 409);
    }
    const hashedPassword = await hashPassword(password);
    const mongoRef = generateMongoRef();
    await sqlClient.query(SQL_QUERIES.insertUser, [email, hashedPassword, mongoRef]);
    await saveDocument(Users, { mongo_ref: mongoRef, email, name, age });
  } finally {
    sqlClient.release();
  }
};
