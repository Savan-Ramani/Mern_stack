import request from 'supertest';
import app from '../app';
import { clearCollections, connectTestDB, disconnectTestDB } from './setup';

const registerAndLogin = async () => {
  const user = { email: 'user@mail.com', password: 'pass123' };
  await request(app).post('/api/auth/register').send(user);
  const res = await request(app).post('/api/auth/login').send(user);
  return res.body.token;
};

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearCollections();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Category API Tests', () => {
  it('should create category and fetch tree', async () => {
    const token = await registerAndLogin();

    const root = await request(app).post('/api/category').set('Authorization', `Bearer ${token}`).send({ name: 'Electronics' });

    expect(root.status).toBe(201);

    const tree = await request(app).get('/api/category').set('Authorization', `Bearer ${token}`);

    expect(tree.status).toBe(200);
    expect(tree.body.length).toBe(1);
  });

  it('should propagate inactive status to children', async () => {
    const token = await registerAndLogin();

    // Root
    const root = await request(app).post('/api/category').set('Authorization', `Bearer ${token}`).send({ name: 'Parent' });

    // Child
    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Child', parent: root.body._id });

    // Inactivate root
    await request(app).put(`/api/category/${root.body._id}`).set('Authorization', `Bearer ${token}`).send({ status: 'inactive' });

    const tree = await request(app).get('/api/category').set('Authorization', `Bearer ${token}`);

    expect(tree.body[0].status).toBe('inactive');
    expect(tree.body[0].children[0].status).toBe('inactive');
  });

  it('should reassign child categories when parent is deleted', async () => {
    const token = await registerAndLogin();

    const parent = await request(app).post('/api/category').set('Authorization', `Bearer ${token}`).send({ name: 'A' });

    const child = await request(app)
      .post('/api/category')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'B', parent: parent.body._id });

    const res = await request(app).delete(`/api/category/${parent.body._id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const tree = await request(app).get('/api/category').set('Authorization', `Bearer ${token}`);

    expect(tree.body[0].parent).toBe(null);
  });
});
