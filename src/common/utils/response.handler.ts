// export type SuccessResponse<T> = {
//   success: boolean;
//   data: T;
// };

// export type ErrorResponse = {
//   success: boolean;
//   message: string;
// };
// export const getSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
//   success: true,
//   data,
// });
// export const getErrorResponse = (message: string): ErrorResponse => ({
//   success: false,
//   message,
// });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const createResponse = <T>(success: boolean, data?: T, message?: string): ApiResponse<T> => ({
  success,
  data,
  message,
});
