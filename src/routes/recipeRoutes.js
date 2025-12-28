const upload = require('../middlewares/upload')
const express = require('express')
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController')

const router = express.Router()

router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)
router.post('/', upload.single('image'), createRecipe)
router.put('/:id', updateRecipe)
router.delete('/:id', deleteRecipe)

module.exports = router
