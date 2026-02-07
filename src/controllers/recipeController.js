const Recipe = require('../models/Recipe')
const User = require('../models/User')

const buildRecipeUpdate = (body) => {
  // Whitelist de campos para evitar updates que no queremos permitir
  const allowedFields = [
    'title',
    'description',
    'ingredients',
    'steps',
    'prepTime',
    'category',
    'difficulty',
    'servings',
  ]

  return allowedFields.reduce((updates, field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
    return updates
  }, {})
}

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('owner', 'username')
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

const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.user.id })
    res.json(recipes)
  } catch {
    res.status(500).json({ message: 'Error obteniendo recetas' })
  }
}

const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favoriteRecipes',
      populate: { path: 'owner', select: 'username' },
    })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    res.json(user.favoriteRecipes || [])
  } catch {
    res.status(500).json({ message: 'Error obteniendo favoritos' })
  }
}

const toggleFavoriteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id
    const recipe = await Recipe.findById(recipeId)
    if (!recipe) {
      return res.status(404).json({ message: 'Receta no encontrada' })
    }

    const user = await User.findById(req.user.id).select('favoriteRecipes')
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const favoriteRecipes = user.favoriteRecipes || []
    const isFavorite = favoriteRecipes.some(
      (favoriteId) => favoriteId.toString() === recipeId,
    )

    await User.findByIdAndUpdate(req.user.id, {
      [isFavorite ? '$pull' : '$addToSet']: { favoriteRecipes: recipeId },
    })

    res.json({ isFavorite: !isFavorite })
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
  } catch {
    res.status(400).json({ message: 'Error creando receta' })
  }
}

const updateRecipe = async (req, res) => {
  try {
    const updates = buildRecipeUpdate(req.body)
    const isAdmin = req.user?.role === 'admin'
    const recipe = await Recipe.findOneAndUpdate(
      isAdmin
        ? { _id: req.params.id }
        : { _id: req.params.id, owner: req.user.id },
      updates,
      { new: true, runValidators: true },
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
    const isAdmin = req.user?.role === 'admin'
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      ...(isAdmin ? {} : { owner: req.user.id }),
    })

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
  getMyRecipes,
  getFavoriteRecipes,
  toggleFavoriteRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
}
