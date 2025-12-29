const Recipe = require('../models/Recipe')

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
    const recipe = await Recipe.create({
      ...req.body,
      owner: req.user.id,
    })

    res.status(201).json(recipe)
  } catch (error) {
    res.status(400).json({
      message: 'Error creando receta',
      error: error.message,
    })
  }
}

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }

    if (recipe.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    Object.assign(recipe, req.body)
    await recipe.save()

    res.json(recipe)
  } catch (error) {
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
  deleteRecipe,
}
