import bcrypt from "bcrypt";
import { getSQLClient } from "../../common/config/sql-client";
import UserSchema from "../../features/user/models/user.model";
import { AppError } from "../../common/errors/app.error";
import { getErrorMessage } from "../../common/utils/error.utils";

export const signUpUser = async (email: string, password: string, name: string, age: number) => {
  const client = await getSQLClient(); // Lazy connection to SQL
  try {
    // Check if the email already exists
    const checkQuery = `SELECT id FROM users WHERE email = $1;`;
    const existingUser = await client.query(checkQuery, [email]);

    if (existingUser.rows.length > 0) {
      throw new AppError("Email already exists", 400);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a random MongoDB reference
    const mongoRef = Math.random().toString(36).substring(2, 15);

    // Insert user into SQL
    const sqlQuery = `
      INSERT INTO users (email, password_hash, mongo_ref)
      VALUES ($1, $2, $3) RETURNING id;
    `;
    const result = await client.query(sqlQuery, [email, hashedPassword, mongoRef]);
    const userId = result.rows[0].id;

    // Insert user profile into MongoDB
    const userProfile = new UserSchema({
      mongo_ref: mongoRef,
      name,
      age,
    });
    await userProfile.save();

    return { message: "User registered successfully!", userId };
  } catch (error: any) {
    if (error.code === "23505") {
      console.error("Duplicate email error:", error.detail);
      throw new AppError("Email already exists", 400);
    }
    console.error("Error during signup:", error);
    throw new AppError(getErrorMessage(error), 500);
  } finally {
    client.release(); // Release the SQL client back to the pool
  }
};
