const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController')

router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)

router.post('/', upload.single('image'), createRecipe)

router.put('/:id', updateRecipe)
router.delete('/:id', deleteRecipe)

module.exports = router
