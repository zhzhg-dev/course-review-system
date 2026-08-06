const express = require('express')
const router = express.Router()
const User = require('../../schema/schema.js')
const bcrypt = require('bcrypt')
const multer = require('multer') 
const { authenticate } = require('../../middleware/auth')

router.use(authenticate)

function getBucket() {
  return require('../../config/firebase.js')
}

router.post('/updateProfile', async (req, res) => {

  try {

    const { id, fullName, email, phoneNumber, location, bio } = req.body
    if (req.userId !== String(id)) return res.status(403).json({ message: 'Forbidden' })
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phoneNumber,
        location,
        bio
      },
      {
        new: true
      }
    )
    res.json({
      message: 'Profile updated',
    })

  } catch (err) {

    res.status(500).json({
      message: err.message
    })
  }
})


router.post('/updatePassword', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body
    if (req.userId !== String(id)) return res.status(403).json({ message: 'Forbidden' })

    // validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      })
    }

    // find user
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // compare current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      })
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // update password
    user.password = hashedPassword

    await user.save()

    res.status(200).json({
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (req.userId !== String(id)) return res.status(403).json({ message: 'Forbidden' })

    // find and delete user
    const deletedUser = await User.findByIdAndDelete(id)

    // user not found
    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'User deleted successfully',
      id: deletedUser._id
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post(
  '/updateAvatar',
  upload.single('image'),
  async (req, res) => {
    try {

      const file = req.file
      const { userId } = req.body
      if (req.userId !== String(userId)) return res.status(403).json({ message: 'Forbidden' })

      if (!file) {
        return res.status(400).json({
          message: 'No image uploaded'
        })
      }

      if (!userId) {
        return res.status(400).json({
          message: 'User ID is required'
        })
      }

      const bucket = getBucket()

      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      if (user.avatar) {

        try {

          const oldPath = decodeURIComponent(
            user.avatar.split(`/o/`)[1].split('?')[0]
          )
          await bucket.file(oldPath).delete()

        } catch (err) {

          console.log('Delete old image failed')
        }
      }

      const fileName =
        `avatar-${Date.now()}-${file.originalname}`

      const firebaseFile = bucket.file(
        `users/${userId}/${fileName}`
      )

      const stream = firebaseFile.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      })

      stream.on('error', (err) => {

        console.log(err)

        res.status(500).json({
          message: 'Upload failed'
        })
      })

      stream.on('finish', async () => {

        await firebaseFile.makePublic()

        const imageUrl =
          `https://storage.googleapis.com/${bucket.name}/users/${userId}/${fileName}`

        user.avatar = imageUrl

        await user.save()

        res.status(200).json({
          message: 'Avatar uploaded successfully',
          imageUrl
        })
      })

      stream.end(file.buffer)

    } catch (err) {

      console.log(err)

      res.status(500).json({
        message: 'Server error'
      })
    }
  }
)



module.exports = router

