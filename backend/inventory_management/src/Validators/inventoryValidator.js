const { body, query, param } = require('express-validator');

const inventoryValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters long')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim(),
  body('category')
  .notEmpty()
  .withMessage('Category is required'),
  body('imageUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Image must be a valid URL'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
        throw new Error('All tags must be non-empty strings');
      }
      return true;
    }
  ),
  body('isPublic')
    .notEmpty()
    .withMessage('isPublic is required')
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
body('accessUsers')
    .if((value, { req }) => req.body.isPublic === false || req.body.isPublic === 'false')
    .isArray({ min: 1 })
    .withMessage('Access users must be a non-empty array when inventory is private')
    .custom((users) => {
      if (users.some(user => !user.id || !user.name || !user.email)) {
        throw new Error('Each access user must have an ID, name, and email');
      }
      if (users.some(user => typeof user.name !== 'string' || user.name.trim() === '')) {
        throw new Error('Each access user must have a non-empty name');
      }
      if (users.some(user => typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))) {
        throw new Error('Each access user must have a valid email');
      }
      return true;
    }),
  // body('customIdElements')
  //   .optional()
  //   .isArray({ max: 10 })
  //   .withMessage('Custom ID elements must be an array with at most 10 elements')
  //   .custom((elements) => {
  //     if (
  //       elements &&
  //       elements.some(
  //         el =>
  //           !el.type ||
  //           !['fixed', 'random20', 'random32', '6digit', '9digit', 'guid', 'date', 'sequence'].includes(el.type)
  //       )
  //     ) {
  //       throw new Error('Each custom ID element must have a valid type');
  //     }
  //     if (elements && elements.some(el => el.type === 'fixed' && (!el.value || typeof el.value !== 'string'))) {
  //       throw new Error('Fixed custom ID elements must have a valid string value');
  //     }
  //     if (elements && elements.some(el => el.format && typeof el.format !== 'string')) {
  //       throw new Error('Format must be a string if provided');
  //     }
  //     return true;
  //   }),
  body('customFields')
    .optional()
    .isArray({ max: 15 })
    .withMessage('Custom fields must be an array with at most 15 elements')
    .custom((fields) => {
      const typeLimits = { text: 0, multiline: 0, numeric: 0, link: 0, boolean: 0 };
      if (
        fields &&
        fields.some(
          field =>
            !field.type ||
            !['text', 'multiline', 'numeric', 'link', 'boolean'].includes(field.type) ||
            !field.title ||
            typeof field.title !== 'string' ||
            field.title.trim() === '' ||
            (field.description && typeof field.description !== 'string') ||
            (field.showInTable && typeof field.showInTable !== 'boolean')
        )
      ) {
        throw new Error('Each custom field must have a valid type, non-empty title, and optional description and showInTable boolean');
      }
      fields.forEach(field => {
        typeLimits[field.type]++;
        if (typeLimits[field.type] > 3) {
          throw new Error(`Cannot have more than 3 custom fields of type ${field.type}`);
        }
      });
      return true;
    }),
  body('version')
    .notEmpty()
    .withMessage('Version is required')
    .isInt({ min: 0 })
    .withMessage('Version must be a non-negative integer'),
];

const inventoryIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Inventory ID is required')
    .isMongoId()
    .withMessage('Invalid inventory ID format'),
];

const suggestValidation = [
  query('query')
    .notEmpty()
    .withMessage('Query is required')
    .isString()
    .withMessage('Query must be a string')
    .trim(),
];


module.exports = {
  inventoryValidation,
  inventoryIdValidation,
  suggestValidation,
};