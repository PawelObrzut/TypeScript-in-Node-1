import request = require('supertest');
import app from './app';

describe('Testing api endpoints', () => {
  test('sanity check for /test', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      test: 'is working as it should',
    });
  });

  test('get puppies endpoint', async () => {
    const res = await request(app).get('/api/puppies');
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body).toHaveLength(9);
  });

  test('responds with 404 for non existing endpoint', async () => {
    const res = await request(app).get('/api/puppies/15');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({
      message: 'Puppy not found',
    });
  });

  test('updates correct api endpoint', async () => {
    const res = await request(app)
      .put('/api/puppies/12cfc43d-232d-47a4-a604-cae916e3fa36')
      .set('Accept', 'application/json')
      .send({
        name: 'elmo',
        breed: 'chihuahua',
        birthDate: '01/05/2020'
    });
    expect(res.statusCode).toEqual(204);
    expect(res.headers['location']).toEqual('/api/puppies/12cfc43d-232d-47a4-a604-cae916e3fa36');
  });

  test('deletes from correct api endpoint', async () => {
    const res = await request(app).delete('/api/puppies/12cfc43d-232d-47a4-a604-cae916e3fa36')
    expect(res.statusCode).toEqual(204);
  });
});
