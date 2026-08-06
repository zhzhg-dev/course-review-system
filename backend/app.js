if (process.env.NODE_ENV) {

  require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
  })
}else{
  require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes')



const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.get('/', (req, res) => {
  res.json({ service: 'course-review-api', status: 'ok' })
})
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  }
}));
app.use(express.json())
app.use(routes)


async function startServer() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/27017');
  console.log('MongoDB connect success');

  return app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(err => console.error('MongoDB connect failure:', err));
}

module.exports = { app, startServer };

