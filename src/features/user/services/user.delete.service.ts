import { getSQLClient } from '../../../common/config/sql-client';
import { AppError } from '../../../common/errors/app.error';
import { getErrorMessage } from '../../../common/utils/error.utils';
import Logger from '../../../common/utils/logger';
import { SQL_QUERIES } from '../../../common/utils/sql.constants';
import { UserProfile } from '../models/user.model';

export const deleteUserService = async (mongoRef: string): Promise<void> => {
  const sqlClient = await getSQLClient();

  try {
    // Begin SQL transaction
    await sqlClient.query('BEGIN');
    // 1. Delete user from MySQL
    const sqlResult = await sqlClient.query(SQL_QUERIES.deleteUser, [mongoRef]);
    if (sqlResult.rowCount === 0) {
      throw new AppError('User not found in MySQL', 404);
    }

    // 2. Mark user as inactive in MongoDB
    const deletedUser = await UserProfile.findOneAndUpdate(
      { mongo_ref: mongoRef },
      { $set: { active: false, deletedAt: new Date() } },
      { new: true },
    );

    if (!deletedUser) {
      throw new AppError('User not found in MongoDB', 404);
    }

    // Commit SQL transaction
    await sqlClient.query('COMMIT');

    Logger.info(`User with mongo_ref ${mongoRef} successfully deleted from MySQL and marked as inactive in MongoDB`);
  } catch (error) {
    // Rollback SQL transaction if anything goes wrong
    await sqlClient.query('ROLLBACK');
    Logger.error(`Error deleting user with mongo_ref ${mongoRef}:`, error);

    const message = getErrorMessage(error);
    throw new AppError(message || 'Failed to delete user account', error instanceof AppError ? error.status : 500);
  } finally {
    sqlClient.release();
  }
};
