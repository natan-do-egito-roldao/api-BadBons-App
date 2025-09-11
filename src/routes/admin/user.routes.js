import express from 'express'
import { approveUser } from '../../controllers/admin/user.controller.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'

const router = express.Router()

router.patch('/:userId', authenticate, authorize('ADM'), approveUser)

export default router
