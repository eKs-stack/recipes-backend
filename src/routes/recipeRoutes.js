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

// 🔐 privadas
router.get('/mine', auth, getMyRecipes)

// 🌍 públicas
router.get('/', getAllRecipes)
router.get('/:id', getRecipeById)

// 🔐 CRUD protegido
router.post('/', auth, createRecipe)
router.put('/:id', auth, updateRecipe)
router.delete('/:id', auth, deleteRecipe)

module.exports = router
