const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()

const {
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController')

router.get('/mine', auth, getMyRecipes)

router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)

router.post('/', auth, createRecipe)
router.put('/:id', auth, updateRecipe)
router.delete('/:id', auth, deleteRecipe)

module.exports = router
