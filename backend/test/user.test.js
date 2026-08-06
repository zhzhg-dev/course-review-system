const request = require('supertest');
const bcrypt = require('bcrypt');
const { app } = require('../app');
const User = require('../schema/schema');

beforeEach(async () => {
  await User.create({
    fullName: 'Existing Student',
    email: 'student@aucklanduni.ac.nz',
    password: await bcrypt.hash('password123', 10)
  });
});

describe('User API', () => {
  it('registers a new user with a hashed password', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        fullName: 'New Student',
        email: 'new.student@aucklanduni.ac.nz',
        password: 'securepass'
      })
      .expect(200);

    expect(response.body.message).toBe('Register success');

    const savedUser = await User.findOne({ email: 'new.student@aucklanduni.ac.nz' });
    expect(savedUser).toBeTruthy();
    expect(savedUser.password).not.toBe('securepass');
    expect(await bcrypt.compare('securepass', savedUser.password)).toBe(true);
  });

  it('rejects duplicate registration emails', async () => {
    const response = await request(app)
      .post('/user/register')
      .send({
        fullName: 'Existing Student',
        email: 'student@aucklanduni.ac.nz',
        password: 'password123'
      })
      .expect(400);

    expect(response.body.message).toBe('User already exists');
  });

  it('logs in with valid credentials and returns a token', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'student@aucklanduni.ac.nz',
        password: 'password123'
      })
      .expect(200);

    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.fullName).toBe('Existing Student');
    expect(response.body.email).toBe('student@aucklanduni.ac.nz');
  });

  it('rejects an invalid password', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: 'student@aucklanduni.ac.nz',
        password: 'wrong-password'
      })
      .expect(400);

    expect(response.body.message).toBe('Invalid password');
  });
});

