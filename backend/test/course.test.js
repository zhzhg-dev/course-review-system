const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const Course = require('../schema/courseSchema');

const courses = [
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000101'),
    code: 'COMPSCI 732',
    title: 'Software Tools and Techniques',
    professor: 'Dr. Ada Lovelace',
    difficulty: 'Hard',
    credits: '15 Points',
    rating: '4.7',
    reviews: '12',
    semester: 'Semester 1',
    description: 'Advanced software engineering with testing and deployment.'
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000102'),
    code: 'COMPSCI 220',
    title: 'Algorithms and Data Structures',
    professor: 'Dr. Grace Hopper',
    difficulty: 'Medium',
    credits: '15 Points',
    rating: '4.2',
    reviews: '20',
    semester: 'Semester 2',
    description: 'Core algorithms, data structures, and complexity.'
  }
];

beforeEach(async () => {
  await Course.insertMany(courses);
});

describe('Course API', () => {
  it('lists courses sorted by course code', async () => {
    const response = await request(app).get('/course').expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body.map((course) => course.code)).toEqual(['COMPSCI 220', 'COMPSCI 732']);
  });

  it('filters courses by difficulty and search text', async () => {
    const response = await request(app)
      .get('/course')
      .query({ difficulty: 'Hard', search: 'testing' })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].code).toBe('COMPSCI 732');
  });

  it('gets a single course by id', async () => {
    const response = await request(app)
      .get('/course/000000000000000000000101')
      .expect(200);

    expect(response.body.code).toBe('COMPSCI 732');
    expect(response.body.professor).toBe('Dr. Ada Lovelace');
  });

  it('creates a course and rejects duplicate course codes', async () => {
    const newCourse = {
      code: 'COMPSCI 345',
      title: 'Human Computer Interaction',
      professor: 'Dr. Margaret Hamilton',
      difficulty: 'Medium',
      credits: '15 Points',
      semester: 'Semester 1',
      description: 'Designing and evaluating interactive systems.'
    };

    const createResponse = await request(app)
      .post('/course')
      .send(newCourse)
      .expect(201);

    expect(createResponse.body.course.code).toBe('COMPSCI 345');

    const duplicateResponse = await request(app)
      .post('/course')
      .send(newCourse)
      .expect(400);

    expect(duplicateResponse.body.error).toBe('Course code already exists');
  });
});

