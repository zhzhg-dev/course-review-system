const express = require('express')
const router = express.Router()

const courseRoutes = require('./modules/course')
const courseReviewRoutes = require('./modules/courseReview')
const discussionRoutes = require('./modules/discussion')
const mapRoutes = require('./modules/map')
const userRoutes = require('./modules/user')
const profileRoutes = require('./modules/profile')
const settingRoutes = require('./modules/setting')

router.use('/course', courseRoutes)
router.use('/', courseReviewRoutes)
router.use('/discussion', discussionRoutes)
router.use('/map', mapRoutes)
router.use('/user', userRoutes)
router.use('/profile', profileRoutes)
router.use('/setting', settingRoutes)

module.exports = router

