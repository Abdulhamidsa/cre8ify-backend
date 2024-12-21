interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export const getSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});
