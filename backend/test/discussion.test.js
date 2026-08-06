const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const DiscussionPost = require('../schema/discussionSchema');

const posts = [
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000201'),
    initials: 'AL',
    name: 'Alex Lee',
    time: '1 hour ago',
    body: 'Testing backend APIs for the COMPSCI 732 project.',
    tags: ['testing', 'backend', 'study'],
    counts: [4, 1],
    likedBy: ['student@example.com'],
    replies: [
      {
        initials: 'EW',
        name: 'Emily Wong',
        time: '30 minutes ago',
        body: 'The in-memory MongoDB setup is very useful.'
      }
    ],
    createdAt: new Date('2026-05-01T09:00:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000202'),
    initials: 'MC',
    name: 'Mike Chen',
    time: '2 hours ago',
    body: 'Frontend tag filtering needs stable trending tags.',
    tags: ['frontend', 'testing', 'tags'],
    counts: [8, 0],
    likedBy: [],
    replies: [],
    createdAt: new Date('2026-05-02T09:00:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId('000000000000000000000203'),
    initials: 'NP',
    name: 'Nina Patel',
    time: '3 hours ago',
    body: 'MongoDB aggregation can sort tags by popularity.',
    tags: ['backend', 'mongodb', 'tags'],
    counts: [2, 0],
    likedBy: [],
    replies: [],
    createdAt: new Date('2026-05-03T09:00:00.000Z')
  }
];

beforeEach(async () => {
  await DiscussionPost.insertMany(posts);
});

describe('Discussion API', () => {
  it('lists posts by most recent by default', async () => {
    const response = await request(app).get('/discussion').expect(200);

    expect(response.body).toHaveLength(3);
    expect(response.body[0].body).toContain('MongoDB aggregation');
    expect(response.body[0].counts).toEqual([2, 0]);
  });

  it('filters posts by tag and sorts by helpful count', async () => {
    const response = await request(app)
      .get('/discussion')
      .query({ tag: 'testing', sort: 'helpful' })
      .expect(200);

    expect(response.body.map((post) => post.name)).toEqual(['Mike Chen', 'Alex Lee']);
  });

  it('filters posts that contain all selected tags', async () => {
    const response = await request(app)
      .get('/discussion')
      .query({ tags: 'backend,tags' })
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Nina Patel');
  });

  it('returns tags ordered by usage count for Trending Tags', async () => {
    const response = await request(app).get('/discussion/tags').expect(200);

    expect(response.body.slice(0, 3)).toEqual(['backend', 'tags', 'testing']);
    expect(response.body).toContain('mongodb');
  });

  it('creates a post and normalizes tag input', async () => {
    const response = await request(app)
      .post('/discussion')
      .send({
        initials: 'ZT',
        name: 'Zoe Taylor',
        body: 'Can anyone review our deployment checklist?',
        tags: [' #deployment ', 'testing', '']
      })
      .expect(201);

    expect(response.body.post.name).toBe('Zoe Taylor');
    expect(response.body.post.tags).toEqual(['deployment', 'testing']);
    expect(response.body.post.counts).toEqual([0, 0]);
  });

  it('increments helpful once and blocks duplicate helpful votes', async () => {
    const firstResponse = await request(app)
      .patch('/discussion/000000000000000000000202/metrics')
      .send({ index: 0, userKey: 'new-user@example.com' })
      .expect(200);

    expect(firstResponse.body.post.counts[0]).toBe(9);
    expect(firstResponse.body.post.likedBy).toContain('new-user@example.com');

    const duplicateResponse = await request(app)
      .patch('/discussion/000000000000000000000202/metrics')
      .send({ index: 0, userKey: 'new-user@example.com' })
      .expect(400);

    expect(duplicateResponse.body.message).toBe('You have already marked this post as helpful');
  });

  it('adds a reply and keeps the reply count synchronized', async () => {
    const response = await request(app)
      .post('/discussion/000000000000000000000202/replies')
      .send({
        initials: 'SJ',
        name: 'Sarah Johnson',
        body: 'I can help test this flow.'
      })
      .expect(201);

    expect(response.body.post.replies).toHaveLength(1);
    expect(response.body.post.counts).toEqual([8, 1]);
  });
});

