const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../index');
const request = supertest(app);
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`); // eslint-disable-line
});

const databaseName = 'test';

beforeAll(async () => {
  const url = `mongodb://127.0.0.1/${databaseName}`;
  // await mongoose.connect(url, { useNewUrlParser: true });
  await mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    },
    (error) => {
      if (error) {
        console.error(`Problem connecting to Mongo: ${error}`); // eslint-disable-line
      } else {
        console.log('Connected to Mongo 🤝'); // eslint-disable-line
      }
    } // eslint-disable-line
  );
});

// afterAll(async () => {
//   // Closes the Mongoose connection
//   await mongoose.connection.close();
// });

describe('test route for add user', () => {
  let userMock;
  beforeEach(() => {
    userMock = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };
  });

  it('Should save user to database', async (done) => {
    const res = await request.post('/users').send({
      ...userMock,
    });
    expect(res.status).toBe(201);
    done();
  });
  it('Should not save user to database', async (done) => {
    userMock.password = undefined;
    const res = await request.post('/users').send({
      userMock,
    });
    expect(res.status).toBe(400);
    done();
  });
  it('Should not save user to database, because of async error', async (done) => {
    userMock.firstName = {};

    const res = await request.post('/users').send({
      ...userMock,
    });
    expect(res.status).toBe(500);
    done();
  });
});
