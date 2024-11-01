const request = require('supertest');
const app = require('../app');
const { ReadingList, User } = require('../models');
const { sequelize } = require('../models'); 

beforeAll(async () => {
});

afterAll(async () => {
  await sequelize.close();
});

describe('ReadingList Controller', () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      username: 'testuser',
      password: 'password123',
	  email: 'testuser@example.com',
    });
  });

  afterEach(async () => {
    await ReadingList.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
  });

  test('should add manga to the reading list', async () => {
    const mangaId = 1;
    const response = await request(app)
      .post('/manga') 
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ mangaId });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId', user.userId);
    expect(response.body).toHaveProperty('mangaId', mangaId);
  });

  test('should return an error if manga is already in the list', async () => {
    const mangaId = 1; 
    await ReadingList.create({ userId: user.userId, mangaId, status: 'To Read', progress: 0 });

    const response = await request(app)
      .post('/manga') 
      .set('Authorization', `Bearer ${user.token}`)
      .send({ mangaId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You already add this manga on your list');
  });

  test('should remove manga from the reading list', async () => {
    const mangaId = 1;
    await ReadingList.create({ userId: user.userId, mangaId, status: 'To Read', progress: 0 });

    const response = await request(app)
      .delete(`/manga/${mangaId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Manga is removed from your list');
  });

  test('should return error if manga not found when removing', async () => {
    const response = await request(app)
      .delete('/manga/999')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Manga not found');
  });

  test('should update progress of the manga', async () => {
    const mangaId = 1;
    await ReadingList.create({ userId: user.userId, mangaId, status: 'To Read', progress: 0 });

    const response = await request(app)
      .put('/manga/progress')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ mangaId, progress: 3 });

    expect(response.status).toBe(200);
    expect(response.body.progress).toBe(3);
    expect(response.body.status).toBe('Reading');
  });

  test('should return error if manga not found when updating progress', async () => {
    const response = await request(app)
      .put('/manga/progress')
      .set('Authorization', `Bearer ${user.token}`)
      .send({ mangaId: 999, progress: 1 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Manga not found');
  });
});
