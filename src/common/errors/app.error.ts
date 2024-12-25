import { getErrorMessage } from '../utils/error.utils';

export class AppError extends Error {
  public status: number;

  constructor(error: unknown, status = 500) {
    super(getErrorMessage(error));
    this.status = status;
  }
}
