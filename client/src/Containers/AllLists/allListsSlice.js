/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  fetchAllLists,
  addList,
  updateListsOrderInDb,
  updateTasksOrderInDb,
  deleteList,
  addSection,
  deleteSection,
  addNewTask,
  addExistingTask,
  updateTask,
} from './allListsAPI';

const initialState = {
  lists: [],
  status: 'idle',
  currentList: null, // TODO: maybe set to {}
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchAllListsAsync())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchAllListsAsync = createAsyncThunk(
  'allLists/fetchAllLists',
  // The value we return becomes the `fulfilled` action payload
  async () => fetchAllLists()
);

export const addListAsync = createAsyncThunk(
  'allLists/addList',
  // The value we return becomes the `fulfilled` action payload
  async (title) => addList(title)
);

export const updateListsOrderAsync = createAsyncThunk(
  'allLists/updateListsOrder',
  // The value we return becomes the `fulfilled` action payload
  async (lists, { dispatch, getState }) => {
    // eslint-disable-next-line no-use-before-define
    await dispatch(updateListsOrder(lists));
    const updatedListIds = _.map(getState().allLists.lists, '_id');
    updateListsOrderInDb(updatedListIds);
  }
);

export const updateTasksOrderAsync = createAsyncThunk(
  'allLists/updateTasksOrder',
  // The value we return becomes the `fulfilled` action payload
  async (tasks, { dispatch, getState }) => {
    // eslint-disable-next-line no-use-before-define
    await dispatch(updateTasksOrder(tasks));
    const currListId = getState().allLists.currentList._id;
    const sections = _.map(
      getState().allLists.currentList.sections,
      (section) => {
        const currSection = {
          _id: section._id,
          tasks: _.map(section.tasks, '_id'),
        };
        return currSection;
      }
    );
    updateTasksOrderInDb(currListId, sections);
  }
);

export const updateSectionsOrderAsync = createAsyncThunk(
  'allLists/updateSectionsOrder',
  // The value we return becomes the `fulfilled` action payload
  async (sections, { dispatch, getState }) => {
    // eslint-disable-next-line no-use-before-define
    await dispatch(updateSectionsOrder(sections));
    const currListId = getState().allLists.currentList._id;
    const updatedSections = _.map(
      getState().allLists.currentList.sections,
      (section) => {
        const currSection = {
          _id: section._id,
          tasks: _.map(section.tasks, '_id'),
        };
        return currSection;
      }
    );
    updateTasksOrderInDb(currListId, updatedSections);
  }
);

export const deleteListAsync = createAsyncThunk(
  'allLists/deleteList',
  // The value we return becomes the `fulfilled` action payload
  async (listId) => deleteList(listId)
);

export const addSectionAsync = createAsyncThunk(
  'allLists/addSection',
  // The value we return becomes the `fulfilled` action payload
  async ({ title, listId }) => addSection({ title, listId })
);

export const deleteSectionAsync = createAsyncThunk(
  'allLists/deleteSection',
  // The value we return becomes the `fulfilled` action payload
  async ({ sectionId, listId }) => deleteSection({ sectionId, listId })
);

export const addNewTaskAsync = createAsyncThunk(
  'allLists/addNewTask',
  // The value we return becomes the `fulfilled` action payload
  async ({ title, listId, sectionId }) =>
    addNewTask({ title, listId, sectionId })
);

export const addExistingTaskAsync = createAsyncThunk(
  'allLists/addExistingTask',
  // The value we return becomes the `fulfilled` action payload
  async ({ taskId, listId, sectionId }) =>
    addExistingTask({ taskId, listId, sectionId })
);

export const updateTaskAsync = createAsyncThunk(
  'allLists/updateTask',
  // The value we return becomes the `fulfilled` action payload
  async ({ taskId, payload }) => updateTask({ taskId, payload })
);

export const allListsSlice = createSlice({
  name: 'allLists',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    updateListsOrder: (state, action) => {
      const { source, destination } = action.payload;
      const [movedList] = state.lists.splice(source.index, 1);
      state.lists.splice(destination.index, 0, movedList);
    },
    updateSectionsOrder: (state, action) => {
      const { source, destination } = action.payload;
      const [movedSection] = state.currentList.sections.splice(source.index, 1);
      state.currentList.sections.splice(destination.index, 0, movedSection);
    },
    updateTasksOrder: (state, action) => {
      const { source, destination } = action.payload;
      const sourceSectionIndex = state.currentList.sections.findIndex(
        (section) => section._id === source.droppableId
      );
      const [movedTask] = state.currentList.sections[
        sourceSectionIndex
      ].tasks.splice(source.index, 1);
      // Move task within the same section
      if (source.droppableId === destination.droppableId) {
        state.currentList.sections[sourceSectionIndex].tasks.splice(
          destination.index,
          0,
          movedTask
        );
      } else {
        // Move task to another section
        const destinationSectionIndex = state.currentList.sections.findIndex(
          (section) => section._id === destination.droppableId
        );
        state.currentList.sections[destinationSectionIndex].tasks.splice(
          destination.index,
          0,
          movedTask
        );
      }
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    showList: (state, action) => {
      state.currentList = state.lists.find(
        (list) => list._id === action.payload
      );
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setTaskTitle: (state, action) => {
      const sectionIndex = state.currentList.sections.findIndex(
        (section) => section._id === action.payload.sectionId
      );
      const taskIndex = state.currentList.sections[
        sectionIndex
      ].tasks.findIndex((task) => task._id === action.payload.taskId);
      state.currentList.sections[sectionIndex].tasks[taskIndex].title =
        action.payload.title;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllListsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllListsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = null;
      })
      .addCase(addListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
      })
      .addCase(updateListsOrderAsync.pending, (state) => {
        state.status = 'syncing with database';
      })
      .addCase(updateListsOrderAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(deleteListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteListAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = null;
      })
      .addCase(addSectionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSectionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = state.lists.find(
          (list) => list._id === state.currentList._id
        );
      })
      .addCase(deleteSectionAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSectionAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = state.lists.find(
          (list) => list._id === state.currentList._id
        );
      })
      .addCase(addNewTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNewTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = state.lists.find(
          (list) => list._id === state.currentList._id
        );
      })
      .addCase(addExistingTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addExistingTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = state.lists.find(
          (list) => list._id === state.currentList._id
        );
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.lists = action.payload;
        state.currentList = state.lists.find(
          (list) => list._id === state.currentList._id
        );
      });
  },
});

export const {
  increment,
  decrement,
  updateListsOrder,
  showList,
  setTaskTitle,
  updateTasksOrder,
  updateSectionsOrder,
} = allListsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLists = (state) => state.allLists.lists;
export const selectStatus = (state) => state.allLists.status;
export const selectCurrentList = (state) => state.allLists.currentList;

export const selectTasksInOtherLists = (state) => {
  if (!state) return [];
  if (!state.allLists) return [];
  if (!state.allLists.currentList) return [];
  const currentListId = state.allLists.currentList._id;
  const otherLists = state.allLists.lists.filter(
    (list) => list._id !== currentListId
  );
  const sectionsInOtherLists = otherLists.reduce(
    (
      acc,
      list // eslint-disable-line
    ) => (acc = [...acc, list.sections]),
    []
  );
  const tasksInOtherLists = sectionsInOtherLists
    .flat()
    .reduce(
      (
        acc,
        section // eslint-disable-line
      ) => (acc = [...acc, section.tasks]),
      []
    )
    .flat();
  const tasksInCurrentList = state.allLists.currentList.sections
    .flat()
    .reduce(
      (
        acc,
        section // eslint-disable-line
      ) => (acc = [...acc, section.tasks]),
      []
    )
    .flat();
  const idsOfTasksInCurrentList = _.map(tasksInCurrentList, '_id');
  const filteredTasksInOtherLists = tasksInOtherLists.filter(
    (task) => !_.includes(idsOfTasksInCurrentList, task._id)
  );
  return _.uniqBy(filteredTasksInOtherLists, '_id');
};

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectLists(getState());
  if (currentValue % 2 === 1) {
    dispatch(increment(amount));
  }
};

export default allListsSlice.reducer;
