import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { getErrorResponse } from "../../common/utils/response.handler";

export const ValidZod = (schema: ZodSchema, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req[source]);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        const field = firstError.path.join(".");
        const message = `Validation failed for '${field}': ${firstError.message}`;
        res.status(400).json(getErrorResponse(message));
        return;
      }
      next(error);
    }
  };
};
