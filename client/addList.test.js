import { render, screen } from '@testing-library/react'
import fireEvent from '@testing-library/fire-event';

import App from './App';

test('show add task', () => {
   render(<App/>);
  //  const input = screen.getByLabelText('addList');

   // assert
});

// jest.mock('../pathToService', () => ({
//   addTask: () => ({list: 'testList'})
// }));

it ('should write task', async () => {
  const input = screen.getByLabelText('addList');
  userEvent.type(input, 'testList');
  await fireEvent.keyDown(domNode, { key: 'Enter', code: 'Enter' });
  expect(input).toHaveBeenCalledWith('testList');
});

it ('should add task', async () => {

});