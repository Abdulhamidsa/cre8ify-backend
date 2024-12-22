import { getSQLClient } from "../../common/config/sql-client";
import { AppError } from "../../common/errors/app.error";
import Logger from "../../common/utils/logger";
import { SQL_QUERIES } from "../../common/utils/sql.constants";
import { hashPassword, generateMongoRef } from "../../common/utils/helpers";
import { saveDocument } from "../../common/utils/mongo.service";
import Users from "../../features/user/models/user.model";
import { SignUpInput, SignUpResponse } from "../../common/types/types";

export const signUpUser = async (input: SignUpInput): Promise<SignUpResponse> => {
  const { email, password, name, age } = input;
  const sqlClient = await getSQLClient();

  try {
    const existingUser = await sqlClient.query(SQL_QUERIES.checkUserExists, [email]);
    if (existingUser.rows.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    const hashedPassword = await hashPassword(password);
    const mongoRef = generateMongoRef();

    const sqlResult = await sqlClient.query(SQL_QUERIES.insertUser, [email, hashedPassword, mongoRef]);
    const userId = sqlResult.rows[0].id;

    try {
      await saveDocument(Users, { mongo_ref: mongoRef, email, name, age });
      Logger.info(`User successfully registered with ID: ${userId}`);
      return { success: true, data: { id: userId, email, name, age } };
    } catch (mongoError) {
      await sqlClient.query(SQL_QUERIES.rollbackUser, [userId]); // Rollback
      Logger.error("Failed to save user profile in MongoDB:", (mongoError as Error).message);
      const errorMessage = (mongoError as Error).message;
      throw new AppError(`Failed to save user profile in MongoDB: ${errorMessage}`, 500);
    }
  } catch (error) {
    throw error instanceof AppError ? error : new AppError("User registration failed", 500);
  } finally {
    sqlClient.release();
    Logger.info("SQL client released after user registration");
  }
};
