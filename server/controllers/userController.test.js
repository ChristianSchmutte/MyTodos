const { addUser } = require('./userController');

const user = require('../models/user');

jest.mock('../models/user');

// Setup
beforeEach(() => {
  user.create = jest.fn();
});

// jest.mock('../models/user', () => ({
//   create: async () => ({
//     _id: 123,
//     firstName: 'firstName',
//     lastName: 'lastName',
//     email: 'email',
//     password: 'password',
//   }),
// }));

describe('addUser', () => {
  let userMock;
  beforeEach(() => {
    userMock = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };
  });

  it('should return message the message with the id of the created user', async () => {
    const mockCreated = {
      _id: 123,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };
    user.create.mockResolvedValue(mockCreated);
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(201);
    expect(mRes.send).toHaveBeenCalledWith({
      message: 'Successfully created new user',
      _id: 123,
    });
  });
  it('should throw an error if firstname is not provided', async () => {
    userMock.firstName = undefined;
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
  });
  it('should throw an error if lastname is not provided', async () => {
    userMock.lastName = undefined;
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
  });
  it('should throw an error if email is not provided', async () => {
    userMock.email = undefined;
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
  });
  it('should throw an error if password is not provided', async () => {
    userMock.password = undefined;
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
  });
  it('should throw an error if password is not provided', async () => {
    userMock.password = null;
    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addUser(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
  });

  it('should throw an error if creating the user was not possible', async () => {
    const mockErr = new Error('Test👘🐼🐼');
    user.create.mockRejectedValue(mockErr);

    const mReq = {
      body: {
        ...userMock,
      },
    };
    const mRes = {
      status: jest.fn(),
    };

    await addUser(mReq, mRes);
    expect(mRes.status).toHaveBeenCalledWith(500);
  });
});
