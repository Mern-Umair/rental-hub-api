import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { chat, searchAI } from '../controllers/ai.controllers.js'

const router = Router()

router.post('/chat', protect, chat)
router.post('/search', protect, searchAI)

export default router