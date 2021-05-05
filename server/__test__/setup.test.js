/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const request = supertest(app);

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === 'ns not found') return;

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes('a background operation is currently running'))
        return;

      console.log(error.message);
    }
  }
}

describe('Testing setup', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    const url = 'mongodb://localhost/test_legacy';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    app.listen(5000);
  });
  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });

  it('should create a user', async () => {
    const mockUser = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@email.com',
      password: '12345678',
    };
    const response = await request
      .post('/users')
      .send(mockUser)
      .set('Content-Type', 'application/json');
    expect(response.body.message).toEqual('Successfully created new user');
    expect(response.status).toEqual(201);
  });

  it('should return an error when passed invalid options', async () => {
    const mockUser = {
      firstName: 'first',
      lastName: 'last',
      email: 'test@email.com',
      password: undefined,
    };

    const response = await request
      .post('/users')
      .send(mockUser)
      .set('Content-Type', 'application/json');
    expect(response.body.message).toEqual('Invalid body');
  });
});
