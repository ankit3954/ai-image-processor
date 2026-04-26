import Joi from 'joi';

export const transformPayloadSchema = Joi.object({
    transformations: Joi.array().items(
        Joi.object({
            
            type: Joi.string()
                .valid('resize', 'crop', 'filter', 'format')
                .required()
                .messages({
                    'any.only': 'Invalid transformation type. Must be resize, crop, filter, or format.',
                    'any.required': 'Every transformation must include a "type" field.'
                }),

            value: Joi.alternatives().conditional('type', {
                switch: [
                    {
                        is: 'resize',
                        then: Joi.object({
                            width: Joi.number().integer().positive().max(3000).required()
                                .messages({
                                    'number.base': 'Resize width must be a number.',
                                    'number.max': 'Our servers only support widths up to 3000px to prevent memory crashes.'
                                }),
                            height: Joi.number().integer().positive().max(3000).required()
                        }).required()
                    },
                    {
                        is: 'crop',
                        then: Joi.object({
                            width: Joi.number().integer().positive().required(),
                            height: Joi.number().integer().positive().required(),
                            left: Joi.number().integer().min(0).required(),
                            top: Joi.number().integer().min(0).required()
                        }).required()
                    },
                    {
                        is: 'filter',
                        then: Joi.object({
                            name: Joi.string().valid('grayscale', 'blur', 'sepia').required()
                        }).required()
                    },
                    {
                        is: 'format',
                        then: Joi.object({
                            type: Joi.string().valid('jpeg', 'png', 'webp').required()
                                .messages({
                                    'any.only': 'We only support converting to jpeg, png, or webp formats.'
                                }),
                            quality: Joi.number().integer().min(1).max(100).optional()
                        }).required()
                    }
                ]
            }).required()
        })
    )
    .min(1)
    .required()
    .messages({
        'array.min': 'You must provide at least one transformation in the array.',
        'any.required': 'The "transformations" array is missing from the request body.'
    })
});