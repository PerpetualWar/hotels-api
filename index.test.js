const request = require('supertest');
const { app } = require('./index');

describe('POST /register', () => {
  it('should register a new user', async () => {
    const email = 'example@example.com';
    const password = '12345678';
    
    const response = await request(app)
      .post('/register')
      .send({ email, password });

    expect(response.status).toBe(200);

  });
});