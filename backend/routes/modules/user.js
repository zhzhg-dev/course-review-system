const express = require('express')
const User = require('../../schema/schema.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { getJwtSecret } = require('../../middleware/auth')

router.post('/register', async (req, res) => {
  try {
    const { email, fullName, password } = req.body

    if (!email || !fullName || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'A name, valid email, and password of at least 8 characters are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // check already exist
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // hash
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword
    })

    res.status(201).json({ message: 'Register success', id: user._id })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
 try {
    const { email, password } = req.body

    const normalizedEmail = String(email || '').trim().toLowerCase()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: '1d' }
    )

    res.json({ token, 
      id: user._id, 
      fullName: user.fullName, 
      email: normalizedEmail,
      location:user.location,
      phoneNumber: user.phoneNumber,
      bio:user.bio,
      photo: user.avatar
    })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router

