const express = require('express')


const {
  searchMemories
} = require('../controllers/memorySearchController')


const {
  createMemory,
  uploadMemoryImage,
  getMemories,
  getMemoryById,
  getMemoriesByMonth,
  updateMemory,
  deleteMemory,
  replaceMemoryImage
} = require('../controllers/memoryController')


const {
  generateMemoryInsight
} = require('../controllers/aiController')


const {
  generateStory
} = require('../controllers/storyController')


const protect =
  require('../middleware/authMiddleware')


const upload =
  require('../middleware/uploadMiddleware')


const router = express.Router()


/*
 * Everything under /api/memories
 * requires authentication.
 */

router.use(protect)


/*
 * AI
 */

router.post(
  '/:id/ai',
  generateMemoryInsight
)


/*
 * Memory creation
 */

router.post(
  '/',
  createMemory
)


/*
 * Memory listing
 */

router.get(
  '/',
  getMemories
)


/*
 * Search
 *
 * Must remain before /:id.
 */

router.get(
  '/search',
  searchMemories
)


/*
 * Monthly memories
 */

router.get(
  '/month/:year/:month',
  getMemoriesByMonth
)


/*
 * Stories
 */

router.post(
  '/story',
  generateStory
)


/*
 * Single memory
 */

router.get(
  '/:id',
  getMemoryById
)


router.put(
  '/:id',
  updateMemory
)


/*
 * Replace image
 */

router.put(
  '/:id/images',
  upload.single('image'),
  replaceMemoryImage
)


/*
 * Add image
 */

router.post(
  '/:id/images',
  upload.single('image'),
  uploadMemoryImage
)


/*
 * Delete memory
 */

router.delete(
  '/:id',
  deleteMemory
)


module.exports = router