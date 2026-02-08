require('./config/env')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User = require('./models/User')
const Recipe = require('./models/Recipe')

const generateSeedPassword = () => crypto.randomBytes(12).toString('base64url')

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL || 'demo@local.dev'
const SEED_USER_USERNAME = process.env.SEED_USER_USERNAME || 'demo'
const SEED_USER_PASSWORD =
  process.env.SEED_USER_PASSWORD || generateSeedPassword()
const SEED_USER_ROLE = process.env.SEED_USER_ROLE || 'admin'
const SEED_RESET = process.env.SEED_RESET === 'true'
const SEED_COUNT = Number.parseInt(process.env.SEED_COUNT, 10)
const SEED_USER_ID = process.env.SEED_USER_ID || ''
const ALLOW_SEED_IN_PROD = process.env.ALLOW_SEED_IN_PROD === 'true'

const assertSafeSeedEnvironment = () => {
  const isProductionLike =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  if (isProductionLike && !ALLOW_SEED_IN_PROD) {
    throw new Error(
      '[seed] Bloqueado en production. Ejecuta seed solo en local/dev.',
    )
  }
}

const sampleRecipes = [
  {
    title: 'Tostadas de aguacate y limón',
    description: 'Desayuno rápido con textura cremosa y toque cítrico.',
    ingredients: [
      'pan de masa madre',
      'aguacate',
      'limón',
      'sal marina',
      'aceite de oliva',
    ],
    steps:
      'Tostar el pan hasta dorar.\nMachacar el aguacate con limón y sal.\nServir sobre el pan y terminar con aceite de oliva.',
    prepTime: 10,
    category: 'Desayuno',
    difficulty: 'Fácil',
    servings: 2,
  },
  {
    title: 'Pollo al horno con papas',
    description: 'Clásico casero con piel dorada y papas tiernas.',
    ingredients: [
      'pollo troceado',
      'papas',
      'ajo',
      'romero',
      'aceite de oliva',
      'sal',
    ],
    steps:
      'Precalentar el horno a 200°C.\nMezclar pollo y papas con aceite, ajo y romero.\nHornear 45-55 minutos hasta dorar.',
    prepTime: 60,
    category: 'Principal',
    difficulty: 'Media',
    servings: 4,
  },
  {
    title: 'Ensalada mediterránea',
    description: 'Ligera, fresca y con buen contraste de sabores.',
    ingredients: [
      'tomates cherry',
      'pepino',
      'aceitunas negras',
      'queso feta',
      'orégano',
      'aceite de oliva',
    ],
    steps:
      'Cortar los vegetales.\nMezclar con aceitunas y feta.\nAliñar con aceite y orégano.',
    prepTime: 15,
    category: 'Entrante',
    difficulty: 'Fácil',
    servings: 2,
  },
  {
    title: 'Arroz con verduras',
    description: 'Acompañamiento versátil con verduras salteadas.',
    ingredients: [
      'arroz',
      'zanahoria',
      'pimiento rojo',
      'calabacín',
      'caldo de verduras',
    ],
    steps:
      'Sofreír las verduras en cubos.\nAgregar el arroz y nacarar.\nCocer con caldo hasta que esté tierno.',
    prepTime: 25,
    category: 'Acompañamiento',
    difficulty: 'Fácil',
    servings: 3,
  },
  {
    title: 'Brownies clásicos',
    description: 'Brownies húmedos con sabor intenso a cacao.',
    ingredients: [
      'chocolate semi amargo',
      'manteca',
      'azúcar',
      'huevos',
      'harina',
      'cacao',
    ],
    steps:
      'Derretir chocolate con manteca.\nAgregar azúcar y huevos.\nIncorporar harina y cacao.\nHornear 25 minutos a 180°C.',
    prepTime: 50,
    category: 'Postre',
    difficulty: 'Media',
    servings: 8,
  },
  {
    title: 'Smoothie de frutos rojos',
    description: 'Bebida fría con frutas y yogur.',
    ingredients: [
      'frutos rojos congelados',
      'banana',
      'yogur natural',
      'miel',
      'leche',
    ],
    steps: 'Licuar todo hasta lograr una textura cremosa.\nServir frío.',
    prepTime: 8,
    category: 'Bebida',
    difficulty: 'Fácil',
    servings: 2,
  },
  {
    title: 'Sopa de lentejas',
    description: 'Plato reconfortante con verduras y especias suaves.',
    ingredients: [
      'lentejas',
      'cebolla',
      'zanahoria',
      'tomate triturado',
      'laurel',
      'caldo',
    ],
    steps:
      'Sofreír cebolla y zanahoria.\nAgregar lentejas y tomate.\nCocer con caldo 30-35 minutos.',
    prepTime: 45,
    category: 'Principal',
    difficulty: 'Media',
    servings: 4,
  },
  {
    title: 'Pasta cremosa con champiñones',
    description: 'Salsa sedosa con champiñones salteados.',
    ingredients: [
      'pasta corta',
      'champiñones',
      'crema',
      'ajo',
      'queso parmesano',
      'perejil',
    ],
    steps:
      'Cocer la pasta al dente.\nSaltear champiñones con ajo.\nAgregar crema y parmesano.\nMezclar con pasta.',
    prepTime: 30,
    category: 'Principal',
    difficulty: 'Media',
    servings: 3,
  },
  {
    title: 'Tortilla de patatas rápida',
    description: 'Versión simple con menos aceite.',
    ingredients: ['patatas', 'huevos', 'cebolla', 'aceite de oliva', 'sal'],
    steps:
      'Cocinar las patatas en sartén con aceite.\nAgregar cebolla.\nMezclar con huevo batido y cuajar.',
    prepTime: 20,
    category: 'Entrante',
    difficulty: 'Media',
    servings: 3,
  },
  {
    title: 'Ramen casero sencillo',
    description: 'Caldo sabroso con fideos y toppings básicos.',
    ingredients: [
      'caldo de pollo',
      'fideos ramen',
      'huevo',
      'cebolla de verdeo',
      'salsa de soja',
      'jengibre',
    ],
    steps:
      'Calentar el caldo con soja y jengibre.\nCocer los fideos.\nServir con huevo y verdeo.',
    prepTime: 35,
    category: 'Principal',
    difficulty: 'Difícil',
    servings: 2,
  },
  {
    title: 'Granola casera',
    description: 'Mezcla crujiente para yogur o leche.',
    ingredients: ['avena', 'almendras', 'miel', 'canela', 'aceite de coco'],
    steps:
      'Mezclar avena con miel, canela y aceite.\nHornear 20-25 minutos.\nEnfriar y guardar.',
    prepTime: 35,
    category: 'Desayuno',
    difficulty: 'Fácil',
    servings: 6,
  },
]

const resolveSeedCount = () => {
  if (Number.isFinite(SEED_COUNT) && SEED_COUNT >= 0) {
    return Math.min(SEED_COUNT, sampleRecipes.length)
  }
  return sampleRecipes.length
}

const findOrCreateUser = async () => {
  const hashedPassword = await bcrypt.hash(SEED_USER_PASSWORD, 10)

  const updateExistingUser = async (user) => {
    user.password = hashedPassword
    if (user.role !== SEED_USER_ROLE) {
      user.role = SEED_USER_ROLE
    }
    await user.save()
    return user
  }

  if (SEED_USER_ID) {
    const existingById = await User.findById(SEED_USER_ID)
    if (existingById) {
      return updateExistingUser(existingById)
    }
  }

  const normalizedEmail = SEED_USER_EMAIL.trim().toLowerCase()
  const normalizedUsername = SEED_USER_USERNAME.trim()

  const existingByEmail = await User.findOne({ email: normalizedEmail })
  if (existingByEmail) {
    return updateExistingUser(existingByEmail)
  }

  const existingByUsername = await User.findOne({
    username: normalizedUsername,
  })
  if (existingByUsername) {
    return updateExistingUser(existingByUsername)
  }

  return User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    role: SEED_USER_ROLE,
  })
}

const seedRecipes = async () => {
  assertSafeSeedEnvironment()
  await connectDB()

  const user = await findOrCreateUser()
  const recipeLimit = resolveSeedCount()
  const seedBatch = sampleRecipes.slice(0, recipeLimit)

  // Limpia solo las recetas del usuario seed si se solicita
  if (SEED_RESET) {
    await Recipe.deleteMany({ owner: user._id })
  }

  if (seedBatch.length === 0) {
    console.log('[seed] No hay recetas para insertar.')
    return
  }

  const titles = seedBatch.map((recipe) => recipe.title)
  const existing = await Recipe.find(
    { owner: user._id, title: { $in: titles } },
    { title: 1 },
  )
  const existingTitles = new Set(existing.map((recipe) => recipe.title))

  // evita duplicar recetas si ya existen para el mismo user
  const toInsert = seedBatch
    .filter((recipe) => !existingTitles.has(recipe.title))
    .map((recipe) => ({
      ...recipe,
      owner: user._id,
    }))

  if (toInsert.length === 0) {
    console.log('[seed] Todas las recetas ya existen para este usuario.')
    return
  }

  await Recipe.insertMany(toInsert)

  console.log(`[seed] Usuario: ${user.email} (${user._id})`)
  console.log(`[seed] Password: ${SEED_USER_PASSWORD}`)
  console.log(`[seed] Recetas insertadas: ${toInsert.length}`)
}

seedRecipes()
  .catch((error) => {
    console.error('[seed] Error al insertar recetas', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
