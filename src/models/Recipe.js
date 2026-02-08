/**
 * Aqui defino el modelo de receta y su relacion con el usuario owner.
 */
const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    steps: {
      type: String,
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Fácil', 'Media', 'Difícil'],
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Recipe', recipeSchema)
