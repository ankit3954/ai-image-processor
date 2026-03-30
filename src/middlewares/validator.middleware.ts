import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction):void => {
    const {error, value} = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if(error){
        const errors = error.details.map((err) => err.message)
        res.status(400).json({
            success: false,
            errors
        })
        return;
    }

    req.body = value;
    next();
}