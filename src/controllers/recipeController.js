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
  console.log('BODY:', req.body)
console.log('FILE:', req.file)
  try {
    let imageUrl = null
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'recipes' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        stream.end(req.file.buffer)
      })

      imageUrl = uploadResult.secure_url
    }

    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients?.split(',') || [],
      steps: req.body.steps,
      prepTime: req.body.prepTime,
      category: req.body.category,
      difficulty: req.body.difficulty,
      servings: req.body.servings,
      image: imageUrl,
    })

    await recipe.save()
    res.status(201).json(recipe)
  } catch (error) {
  console.error('CREATE RECIPE ERROR:', error)
  res.status(400).json({ message: 'Error creando receta' })
}
}

const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

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
  deleteRecipe,
}
