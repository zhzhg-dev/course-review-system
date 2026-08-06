const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  professor: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  credits: {
    type: String,
    default: '3 Credits'
  },
  rating: {
    type: String,
    default: '0.0'
  },
  reviews: {
    type: String,
    default: '0'
  },
  semester: {
    type: String,
    default: 'Semester not set'
  },
  description: {
  type: String,
  default: ''
},
location: {
  building: {
    type: String,
    default: 'Engineering Building A'
  },
  room: {
    type: String,
    default: 'Room 301'
  },
  description: {
    type: String,
    default:
      'Classes are held in Engineering Building A, which is equipped with modern teaching facilities. This is a lecture hall with multimedia equipment.'
  }
},
passRates: [
  {
    year: {
      type: Number,
      required: true
    },
    rate: {
      type: Number,
      required: true
    }
  }
],
assignments: [
  {
    title: {
      type: String,
      required: true
    },
    due: {
      type: String,
      required: true
    },
    state: {
      type: String,
      enum: ['Completed', 'In Progress', 'Upcoming'],
      default: 'Upcoming'
    }
  }
]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
