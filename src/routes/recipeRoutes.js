const express = require('express')
const auth = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const router = express.Router()
const {
  createRecipeValidation,
  updateRecipeValidation,
} = require('../validators/recipeValidators')

const {
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  getFavoriteRecipes,
  toggleFavoriteRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController')

router.get('/mine', auth, getMyRecipes)
router.get('/favorites', auth, getFavoriteRecipes)
router.post('/:id/favorite', auth, toggleFavoriteRecipe)

router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)

router.post('/', auth, createRecipeValidation, validate, createRecipe)
router.put('/:id', auth, updateRecipeValidation, validate, updateRecipe)
router.delete('/:id', auth, deleteRecipe)

module.exports = router
