const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/27017';

// EN: Load backend/.env without adding a new dotenv dependency.
function loadLocalEnv() {
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();

    // EN: Skip empty lines and comments.
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');

    // EN: Existing environment variables win over .env values.
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

// EN: Keep MongoDB URI lookup in one place for seed scripts and future app.js refactor.
function getMongoUri() {
  loadLocalEnv();
  return process.env.MONGO_URI || DEFAULT_MONGO_URI;
}

// EN: Shared MongoDB connection helper. Safe to call multiple times in scripts.
async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);
  const mongoUri = getMongoUri();

  await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${mongoUri}`);

  return mongoose.connection;
}

// EN: Close the connection after one-off scripts such as seed finish.
async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  DEFAULT_MONGO_URI,
  connectDatabase,
  disconnectDatabase,
  getMongoUri,
  loadLocalEnv
};

