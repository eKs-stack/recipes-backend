const Recipe = require('../models/Recipe')
const cloudinary = require('../config/cloudinary')

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
    res.json(recipes)
  } catch {
    res.status(500).json({ message: 'Error obteniendo recetas' })
  }
}

const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }

    res.json(recipe)
  } catch {
    res.status(400).json({ message: 'ID inválido' })
  }
}

const createRecipe = async (req, res) => {
  try {
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)

    if (req.body.ingredients) {
      req.body.ingredients = req.body.ingredients.split(',')
    }

    const recipe = await Recipe.create(req.body)

    res.status(201).json(recipe)
  } catch (error) {
    console.log('MONGOOSE ERROR:', error)
    res.status(500).json({
      name: error.name,
      message: error.message,
      errors: error.errors
    })
  }
}

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }

    res.json(recipe)
  } catch {
    res.status(400).json({ message: 'Error actualizando receta' })
  }
}

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }

    res.json({ message: 'Receta eliminada' })
  } catch {
    res.status(400).json({ message: 'Error eliminando receta' })
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
}