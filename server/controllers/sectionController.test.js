/**
 * @jest-environment node
 */
const {
  addSection,
  updateSection,
  deleteSection,
} = require('./sectionController');
const list = require('../models/list');
const user = require('../models/user');

jest.mock('../models/list');
jest.mock('../models/user');

// Setup
beforeEach(() => {
  user.findById = jest.fn();
  list.findByIdAndUpdate = jest.fn();
  list.findById = jest.fn();
});

// Global mock data
const mockExecPopulate = jest.fn();
let mReq;
let mRes;

describe('sectionController', () => {
  describe('addSection', () => {
    beforeEach(() => {
      mReq = {
        params: {
          userId: 1,
          listId: 2,
        },
        body: { title: 'test title' },
      };
      mRes = {
        status: jest.fn(),
        send: jest.fn(),
      };
      user.findById = jest.fn();
      list.findByIdAndUpdate = jest.fn();
      list.findById = jest.fn();
    });

    it('should add section', async () => {
      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findById.mockResolvedValue({
        populate: () => ({
          execPopulate: mockExecPopulate,
        }),
      });
      await addSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.send).toBeCalledWith('Test');
    });

    it('should handle user model throwing', async () => {
      const mockErr = new Error('Test👘🐼🐼');
      user.findById.mockRejectedValue(mockErr);

      await addSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(400);
      expect(mRes.send).toBeCalledWith({
        error: mockErr,
        message: 'Could not add section',
      });
    });
    it('should handle list model throwing', async () => {
      const mockErr = new Error('Test👘🐼🐼');
      list.findByIdAndUpdate.mockRejectedValue(mockErr);

      await addSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(400);
      expect(mRes.send).toBeCalledWith({
        error: mockErr,
        message: 'Could not add section',
      });
    });
    it('should handle execPopulate throwing', async () => {
      const mockErr = new Error('Test👘🐼🐼');
      user.findById.mockResolvedValue({
        populate: () => ({
          execPopulate: mockExecPopulate.mockRejectedValue(mockErr),
        }),
      });

      await addSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(400);
      expect(mRes.send).toBeCalledWith({
        error: mockErr,
        message: 'Could not add section',
      });
    });
  });
  describe('updateSection', () => {
    beforeEach(() => {
      mReq = {
        params: {
          userId: 1,
          listId: 2,
          sectionId: 3,
        },
        body: { title: 'test title' },
      };
      mRes = {
        status: jest.fn(),
        send: jest.fn(),
      };
    });
    it('should update a section', async () => {
      const mockResEnd = jest.fn();
      mRes.status = jest.fn().mockReturnValue({ end: mockResEnd });
      await updateSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(200);
      expect(mockResEnd).toHaveBeenCalled();
    });
  });
  describe('deleteSection', () => {
    const mockListIdCall = jest.fn();
    let mockList;
    let mockSection;
    const mockCallSectionId = jest.fn();
    const mockSectionRemove = jest.fn();
    const mockListSave = jest.fn();
    beforeEach(() => {
      mReq = {
        params: {
          userId: 1,
          listId: 2,
          sectionId: 3,
        },
      };
      mRes = {
        send: jest.fn(),
        status: jest.fn(),
      };
      mockList = {
        sections: {
          id: mockListIdCall,
        },
        save: mockListSave,
      };
      mockSection = {
        id: mockCallSectionId,
        remove: mockSectionRemove,
      };
      user.findById = jest.fn();
      list.findByIdAndUpdate = jest.fn();
      list.findById = jest.fn();
    });

    it('should delete a section', async () => {
      // res.send call chained to status
      const mockResEnd = { send: jest.fn() };
      mRes.status.mockReturnValue(mockResEnd);

      // controller loops over tasks of deleted sections
      const mockTasks = [1, 2];
      mockSection.remove.mockResolvedValue({ tasks: mockTasks });

      // returns single section
      mockList.sections.id.mockResolvedValue(mockSection);
      list.findById.mockResolvedValue(mockList);

      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findById.mockResolvedValue({
        populate: () => ({
          execPopulate: mockExecPopulate,
        }),
      });
      await deleteSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(200);
      expect(mockResEnd.send).toBeCalledWith('Test');
    });

    it('should catch model error', async () => {
      const mockResEnd = { send: jest.fn() };
      mRes.status.mockReturnValue(mockResEnd);
      const mockErr = new Error('Test👘🐼🐼');

      mockSection.remove.mockRejectedValue(mockErr);

      // returns single section
      mockList.sections.id.mockResolvedValue(mockSection);
      list.findById.mockResolvedValue(mockList);

      mockExecPopulate.mockResolvedValue({ lists: 'Test' });
      user.findById.mockResolvedValue({
        populate: () => ({
          execPopulate: mockExecPopulate,
        }),
      });
      await deleteSection(mReq, mRes);

      expect(mRes.status).toBeCalledWith(500);
      expect(mRes.send).toBeCalledWith({
        error: JSON.stringify(mockErr),
        message: 'Could not delete section',
      });
    });
  });
});
