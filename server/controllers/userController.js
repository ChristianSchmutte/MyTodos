const user = require('../models/user');

async function addUser(req, res) {
  const {
    firstName, lastName, email, password
  } = req.body;

  // combined version like param === (undefined || null || '') doesn't resolve the issue
  const checkUndefined = firstName === undefined
  || lastName === undefined
  || email === undefined
  || password === undefined;
  const checkNull = firstName === null
  || lastName === null
  || email === null
  || password === null;
  const checkEmptyString = firstName === ''
  || lastName === ''
  || email === ''
  || password === '';

  if (checkUndefined || checkNull || checkEmptyString) {
    res.status(400);
    res.send({ message: 'Invalid body' });
  } else {
    try {
      const newUser = await user.create({
        firstName,
        lastName,
        email,
        password,
      });
      res.status(201);
      res.send({ message: 'Successfully created new user', _id: newUser._id }); // eslint-disable-line
    } catch (error) {
      res.status(500);
      console.error(error); // eslint-disable-line
    }
  }
}
module.exports = { addUser };
