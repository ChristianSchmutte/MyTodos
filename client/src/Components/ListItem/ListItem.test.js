import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../app/store';

import { ListItem } from './ListItem'

// jest.mock('../pathToService', () => ({
//   addTask: () => ({list: 'testList'})
// }));

// write task
it ('should write task', async () => {
  let setTest = jest.fn();
  render(
    <Provider store={store}>
      <ListItem />
    </Provider>);
  const input = screen.getByPlaceholderText('Add List');
  userEvent.type(input, 'testList');
  // await fireEvent.keyDown(domNode, { key: 'Enter', code: 'Enter' });
  expect(setTest).toHaveBeenCalledWith('testList');
});
