import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validationMiddleware(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    console.log("Main Error:",error);
    if (error) {
      return res.status(400).json({
        errors: error.details.map(d => d.message),
      });
    }
    next();
  };
}
