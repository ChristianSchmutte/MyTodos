/* eslint-disable comma-dangle */
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { SelectedList } from './SelectedList';

describe('Selected List', () => {
  const mockStore = configureStore([]);

  const mockTask = {
    _id: 3,
    title: 'Test Todo',
    complete: true,
    notes: 'Test note',
    lists: ['Test List'],
  };

  const mockSection = {
    _id: 1,
    title: 'Test Section',
    isDefaultSection: true,
    tasks: [mockTask],
  };

  const mockList = [{ sections: [mockSection], _id: 2 }];

  it('should render a todo', () => {
    const mockedStore = mockStore({
      allLists: {
        currentList: { sections: [mockSection], _id: 2 },
        lists: mockList,
      },
      selectedList: { showAddSectionForm: true },
    });
    render(
      <Provider store={mockedStore}>
        <SelectedList />
      </Provider>
    );
    expect(screen.getByText(mockTask.title));
  });
});
