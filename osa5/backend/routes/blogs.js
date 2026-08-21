import express from 'express'
import { get, getAll, create, deleteBlog, updateBlog } from '../controllers/blogs.js'
import { userExtractor } from '../utils/middleware.js'
const router = express.Router()

router.get('/', getAll)
router.get('/:id', get)
router.post('/', userExtractor, create)
router.delete('/:id', userExtractor, deleteBlog)
router.put('/:id', updateBlog)

export default router