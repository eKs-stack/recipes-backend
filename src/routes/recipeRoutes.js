const auth = require('../middlewares/auth')
const express = require('express')
const router = express.Router()
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController')

router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)

router.post('/', auth, createRecipe)

router.put('/:id', auth, updateRecipe)
router.delete('/:id', auth, deleteRecipe)

module.exports = router
