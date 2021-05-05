const user = require('../models/user');

async function addUser(req, res) {
  const {
    firstName, lastName, email, password
  } = req.body;

  // like param === (undefined || null || '') doesn't resolve the issue
  const checkUndefined = !firstName || !lastName || !email || !password;

  if (checkUndefined) {
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
      res.status(500).end(); // .end()
      // console.error(error); // eslint-disable-line
    }
  }
}
module.exports = { addUser };
