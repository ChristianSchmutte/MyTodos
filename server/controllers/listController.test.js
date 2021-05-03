// add mock req.params user id
// mock user.findby returns: {
// populate: jest.fn() -> { lists: "Hello" }
// }
// expect res.body -> Hello
const {
  getLists,
  addList,
  updateListsOrder,
  updateTasksOrder,
  deleteList,
} = require('./listController');
const list = require('../models/list');
const user = require('../models/user');

jest.mock('../models/list');
jest.mock('../models/user');

jest.mock('../models/user');
jest.mock('../models/list');

describe('listController', () => {
  let mReq;
  let mRes;
  let mockUser;
  const mockExecPopulate = jest.fn();
  const mockErr = new Error('Test👘🐼🐼');
  beforeEach(() => {
    user.findById = jest.fn();
    user.findByIdAndUpdate = jest.fn();
    list.create = jest.fn();
    list.findByIdAndDelete = jest.fn();
    list.findById = jest.fn();
    mReq = {
      params: { userId: 1 },
    };
    mRes = {
      status: jest.fn(),
      send: jest.fn(),
    };
    mockUser = {
      populate: () => ({
        execPopulate: mockExecPopulate,
      }),
    };
  });

  describe('getLists', () => {
    it('should get lists', async () => {
      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findById.mockResolvedValue(mockUser);

      await getLists(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.send).toHaveBeenCalledWith('Test');
    });

    it('should handle error thrown by model', async () => {
      user.findById.mockRejectedValue(mockErr);

      await getLists(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(500);
      expect(mRes.send).toHaveBeenCalledWith({
        error: mockErr,
        message: 'Did not find lists for user',
      });
    });
  });

  describe('addList', () => {
    beforeEach(() => {
      mReq = {
        params: { userId: 1 },
        body: { title: 'Test Body' },
      };
    });

    it('should add a list', async () => {
      list.create.mockResolvedValue({ _id: 'uuid' });
      user.findById.mockResolvedValue({ lists: ['Test Item'] });
      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findByIdAndUpdate.mockResolvedValue(mockUser);

      await addList(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(201);
      expect(mRes.send).toHaveBeenCalledWith('Test');
    });

    it('should handle invalid input', async () => {
      mReq.body.title = undefined;

      await addList(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.send).toHaveBeenCalledWith({ message: 'Invalid body' });
    });

    it('should handle errors thrown by model', async () => {
      list.create.mockRejectedValue(mockErr);

      await addList(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.send).toHaveBeenCalledWith({
        error: mockErr,
        message: 'Could not add list',
      });
    });
  });
  describe('updateListsOrder', () => {
    beforeEach(() => {
      mReq = {
        params: { userId: 1 },
        body: { lists: ['Test Item'] },
      };
    });

    it('should update task order', async () => {
      user.findByIdAndUpdate.mockResolvedValue({ lists: 'Test' });
      await updateListsOrder(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.send).toHaveBeenCalledWith('Test');
    });

    it('should handle model thrown error', async () => {
      user.findByIdAndUpdate.mockRejectedValue(mockErr);

      await updateListsOrder(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(500);
      expect(mRes.send).toHaveBeenCalledWith({
        error: mockErr,
        message: 'Could not update lists order',
      });
    });
  });

  describe('updateTasksOrder', () => {
    const mockSectionIdCall = jest.fn();
    const mockListSaveCall = jest.fn();
    const mockList = {
      id: mockSectionIdCall,
      save: mockListSaveCall,
    };
    beforeEach(() => {
      mReq = {
        params: { listId: 2 },
        body: { sections: [{ _id: 2, tasks: ['test item'] }] },
      };
    });

    it('should update section order', async () => {
      mockSectionIdCall.mockResolvedValue({ tasks: ['dummy section task'] });
      mockListSaveCall.mockResolvedValue('Test');
      list.findById.mockResolvedValue(mockList);
      await updateTasksOrder(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mRes.send).toHaveBeenCalledWith('Test');
    });

    it('should handle model error thrown', async () => {
      list.findById.mockRejectedValue(mockErr);

      await updateTasksOrder(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(500);
      expect(mRes.send).toHaveBeenCalledWith({
        error: mockErr,
        message: 'Could not update tasks order',
      });
    });
  });

  describe('deleteList', () => {
    const mockResSend = jest.fn();
    beforeEach(() => {
      mReq = {
        params: {
          listId: 1,
          userId: 2,
        },
      };
      mRes = {
        status: jest.fn().mockReturnValue({ send: mockResSend }),
        send: jest.fn(),
      };
    });

    it('should delete a list', async () => {
      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findByIdAndUpdate.mockResolvedValue(mockUser);
      await deleteList(mReq, mRes);

      expect(list.findByIdAndDelete).toHaveBeenCalledWith(1);
      expect(mRes.status).toHaveBeenCalledWith(200);
      expect(mockResSend).toHaveBeenCalledWith('Test');
    });

    it('should handle model thrown errors', async () => {
      list.findByIdAndDelete.mockRejectedValue(mockErr);

      await deleteList(mReq, mRes);

      expect(mRes.status).toHaveBeenCalledWith(400);
      expect(mRes.send).toHaveBeenCalledWith({
        error: mockErr,
        message: 'Could not delete list',
      });
    });
  });
});
