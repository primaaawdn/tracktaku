const { describe, test, expect, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, sequelize } = require("../models");

const validUser = {
  email: 'alistair@mail.com',
  password: '123456',
  username: 'alistair'
};

const invalidUser = {
  email: 'wronguser@example.com',
  password: 'wrongpassword'
};

let access_token;

beforeAll(async () => {
  await request(app).post("/register").send(validUser);
  const loginResponse = await request(app).post("/user/login").send(validUser);
  access_token = loginResponse.body.access_token;
});

describe('POST /register', () => {
  test('Berhasil register user baru', async () => {
    const response = await request(app).post('/user/register').send({
      email: 'newuser@example.com',
      password: '123456',
      username: 'NewUser'
    });

    expect(response.status).toBe(201);
    expect(response.text).toContain('Welcome, NewUser');
  });

  test('Gagal register dengan email yang sudah ada', async () => {
    const response = await request(app).post('/user/register').send(validUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is taken');
  });
});

describe('POST /login', () => {
  test('Berhasil login dan mendapatkan access_token', async () => {
    const response = await request(app).post('/user/login').send(validUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  test('Email tidak diberikan', async () => {
    const response = await request(app).post('/user/login').send({ password: validUser.password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is required');
  });

  test('Password tidak diberikan', async () => {
    const response = await request(app).post('/user/login').send({ email: validUser.email });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is required');
  });

  test('Email tidak terdaftar', async () => {
    const response = await request(app).post('/user/login').send(invalidUser);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email');
  });

  test('Password salah', async () => {
    const response = await request(app).post('/user/login').send({ email: validUser.email, password: invalidUser.password });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
  });
});

describe('GET /all', () => {
  test('Berhasil mendapatkan daftar semua user', async () => {
    const response = await request(app).get('/user/all').set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('PUT /:id', () => {
  test('Berhasil update data user', async () => {
    const user = await User.findOne({ where: { email: validUser.email } });
    const response = await request(app)
      .put(`/user/${user.id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ username: "UpdatedUser" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Great! You have successfully updated your profile.');
  });

  test('Gagal update user yang tidak ditemukan', async () => {
    const response = await request(app)
      .put(`/user/9999`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ username: "UpdatedUser" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User with id:9999 not found');
  });
});

describe('DELETE /:id', () => {
  test('Berhasil delete user', async () => {
    const user = await User.findOne({ where: { email: validUser.email } });
    const response = await request(app)
      .delete(`/user/${user.id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

  test('Gagal delete user yang tidak ditemukan', async () => {
    const response = await request(app)
      .delete(`/user/9999`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User with id:9999 not found');
  });
});