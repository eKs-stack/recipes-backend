const { body } = require('express-validator')

const difficultyValues = ['Fácil', 'Media', 'Difícil']

const createRecipeValidation = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Título inválido'),
  body('description')
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Descripción inválida'),
  body('ingredients').isArray({ min: 1 }).withMessage('Ingredientes inválidos'),
  body('ingredients.*')
    .isString()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('Ingrediente inválido'),
  body('steps')
    .isString()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage('Pasos inválidos'),
  body('prepTime').isInt({ min: 1, max: 1000 }).withMessage('Tiempo inválido'),
  body('category')
    .isString()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage('Categoría inválida'),
  body('difficulty').isIn(difficultyValues).withMessage('Dificultad inválida'),
  body('servings')
    .isInt({ min: 1, max: 200 })
    .withMessage('Porciones inválidas'),
]

const updateRecipeValidation = [
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage('Título inválido'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Descripción inválida'),
  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Ingredientes inválidos'),
  body('ingredients.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('Ingrediente inválido'),
  body('steps')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 5000 })
    .withMessage('Pasos inválidos'),
  body('prepTime')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Tiempo inválido'),
  body('category')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 40 })
    .withMessage('Categoría inválida'),
  body('difficulty')
    .optional()
    .isIn(difficultyValues)
    .withMessage('Dificultad inválida'),
  body('servings')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Porciones inválidas'),
]

module.exports = { createRecipeValidation, updateRecipeValidation }
