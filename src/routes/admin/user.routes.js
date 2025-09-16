import express from 'express'
import { approveUser, disapproveUser } from '../../controllers/admin/user.controller.js'
import { authenticate } from '../../middleware/authenticate.js'
import { authorize } from '../../middleware/authorize.js'

const router = express.Router()

router.patch('/approve-user/:userId', authenticate, authorize('ADM'), approveUser)
router.patch('/disapprove-user/:userId', authenticate, authorize('ADM'), disapproveUser)

export default router
