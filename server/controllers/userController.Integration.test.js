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
it('Should save user to database', async (done) => {
  const res = await request.post('/users').send({
    firstName: 'Anna',
    lastName: 'Lamer',
    email: 'testing@email.com',
    password: 'secret',
  });
  done();
});
