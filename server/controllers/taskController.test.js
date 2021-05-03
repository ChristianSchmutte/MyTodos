const {
  addNewTask,
  addExistingTask,
  updateTask,
  deleteTask,

} = require('./taskController');

// jest.mock('../models/task', () => ({
//   create: async () => {
//     const asyncMock = jest.fn().mockRejectedValue(new Error('Async error'));
//     await asyncMock();
//   },
// }));

const task = require('../models/task');
const list = require('../models/list');
const user = require('../models/user');
const mockExecPopulate = jest.fn();

// jest.mock('../models/task');

// Setup
beforeEach(() => {
  task.create = jest.fn();
  list.findById = jest.fn();
  list.sections = {
    id: jest.fn(),
  };
  user.findById = jest.fn();
  user.populate = jest.fn();
  task.findByIdAndUpdate = jest.fn();
});

describe('addNewTask', () => {
  it('should add a new task and return user lists', async () => {
    task.create.mockResolvedValue({
      _id: 123,
      title: 'mock create: new task',
      user: '507f1f77bcf86cd799439011',
      list: ['507f1f77bcf86cd799439012'],
    });
    list.findById.mockResolvedValue({
      sections: {
        id: async () => ({
          title: 'new section',
          isDefaultSection: false,
          tasks: ['507f1f77bcf86cd799439014'],
        }),
      },
      save: jest.fn(),
    });
    mockExecPopulate.mockResolvedValue({ lists: 'some lists' });
    user.findById.mockResolvedValue({
      populate: () => ({
        execPopulate: mockExecPopulate,
      }),
    });
    const mReq = {
      body: {
        title: 'request: new task',
      },
      params: {
        userId: '507f1f77bcf86cd799439011',
        listId: '507f1f77bcf86cd799439012',
        sectionId: '507f1f77bcf86cd799439013',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addNewTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(201);
    expect(mRes.send).toHaveBeenCalledWith('some lists');
  });
});

describe('addExistingTask', () => {
  it('should throw error code 400 if taskId is not provided', async () => {
    const mReq = {
      body: {
        taskId: undefined,
      },
      params: {
        userId: '507f1f77bcf86cd799439011',
        listId: '507f1f77bcf86cd799439012',
        sectionId: '507f1f77bcf86cd799439013',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addExistingTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Body did not include "taskId" property' });
  });
  it('should add a new task by updating the lists and sections and return user lists', async () => {
    task.findByIdAndUpdate.mockResolvedValue({
    });
    list.findById.mockResolvedValue({
      sections: {
        id: async () => ({
          title: 'new section',
          isDefaultSection: false,
          tasks: ['507f1f77bcf86cd799439014'],
        }),
      },
      save: jest.fn(),
    });
    mockExecPopulate.mockResolvedValue({ lists: 'some lists' });
    user.findById.mockResolvedValue({
      populate: () => ({
        execPopulate: mockExecPopulate,
      }),
    });
    const mReq = {
      body: {
        taskId: '507f1f77bcf86cd799439014',
      },
      params: {
        userId: '507f1f77bcf86cd799439011',
        listId: '507f1f77bcf86cd799439012',
        sectionId: '507f1f77bcf86cd799439013',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await addExistingTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(201);
    expect(mRes.send).toHaveBeenCalledWith('some lists');
  });
});
describe('updateTask', () => {
  it('should update a task and return user lists', async () => {
    task.findByIdAndUpdate.mockResolvedValue({
    });
    mockExecPopulate.mockResolvedValue({ lists: 'some lists' });
    user.findById.mockResolvedValue({
      populate: () => ({
        execPopulate: mockExecPopulate,
      }),
    });
    const mReq = {
      body: {
        task: {
          title: 'updated title',
          user: '507f1f77bcf86cd799439011',
          lists: ['507f1f77bcf86cd799439012'],
        },
      },
      params: {
        userId: '507f1f77bcf86cd799439011',
        taskId: '507f1f77bcf86cd799439012',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await updateTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(200);
    expect(mRes.send).toHaveBeenCalledWith('some lists');
  });
  it('should throw an error code 400 if updating a task, finding a user or populating the data fail', async () => {
    const mockErr = new Error('Test👘🐼🐼');
    task.findByIdAndUpdate.mockRejectedValue(mockErr);
    const mReq = {
      body: {
        task: {
          title: 'updated title',
          user: '507f1f77bcf86cd799439011',
          lists: ['507f1f77bcf86cd799439012'],
        },
      },
      params: {
        userId: '507f1f77bcf86cd799439012', // undefined
        taskId: '507f1f77bcf86cd799439012',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await updateTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Could not update task' });
  });
});
describe('deleteTask', () => {
  it('should delete a task, remove the section and return the updated user', async () => {
    user.findById.mockResolvedValue({
      lists: {
        id: async () => ({
          title: 'new section',
          isDefaultSection: false,
          tasks: ['507f1f77bcf86cd799439014'],
          sections: {
            id: async () => ({
              title: 'new section',
              isDefaultSection: false,
              tasks: ['507f1f77bcf86cd799439014'],
              remove: jest.fn(),
            }),
          },
        }),
      },
      save: async () => 'database: save',
    });
    const mReq = {
      params: {
        userId: '507f1f77bcf86cd799439010',
        listId: '507f1f77bcf86cd799439011',
        sectionId: '507f1f77bcf86cd799439012',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await deleteTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(201);
    expect(mRes.send).toHaveBeenCalledWith('database: save');
  });
  it('should throw error code 400 if processing is not possible', async () => {
    const mockErr = new Error('Test👘🐼🐼');
    user.findById.mockRejectedValue(mockErr);
    const mReq = {
      params: {
        userId: '507f1f77bcf86cd799439010',
        listId: '507f1f77bcf86cd799439011',
        sectionId: '507f1f77bcf86cd799439012',
      },
    };
    const mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };

    await deleteTask(mReq, mRes);

    expect(mRes.status).toHaveBeenCalledWith(400);
    expect(mRes.send).toHaveBeenCalledWith({ message: 'Could not delete section' });
  });
});
