import request from 'supertest';
import app from '../app';
import { clearCollections, connectTestDB, disconnectTestDB } from './setup';

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Auth API Tests', () => {
  const user = {
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register duplicate users', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('should login successfully', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send(user);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'wrong@mail.com', password: 'bad' });

    expect(res.status).toBe(401);
  });
});
