import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Generic validation middleware factory for Zod schemas
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate ('body', 'params', 'query')
 */
export function validateSchema<T>(
  schema: ZodSchema<T>,
  target: 'body' | 'params' | 'query' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the request data with validated data (removes extra fields, applies transforms)
      // Note: req.query is read-only in Express v5, so skip assignment for query
      if (target !== 'query') {
        req[target] = validatedData;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
      }
      console.log(error);
      
      // Handle unexpected errors
      return res.status(500).json({
        error: 'Internal validation error',
      });
    }
  };
}

/**
 * Convenience function for body validation (most common use case)
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return validateSchema(schema, 'body');
}

/**
 * Convenience function for params validation
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return validateSchema(schema, 'params');
}

/**
 * Convenience function for query validation
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return validateSchema(schema, 'query');
}