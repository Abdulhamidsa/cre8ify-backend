type SuccessResponse<T> = {
  success: boolean;
  data: T;
};

type ErrorResponse = {
  success: boolean;
  message: string;
};
export const getSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});
export const getErrorResponse = (message: string): ErrorResponse => ({
  success: false,
  message,
});
