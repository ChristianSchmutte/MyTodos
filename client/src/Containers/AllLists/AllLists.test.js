import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
// import { store } from '../../app/store';
import { AllLists } from './AllLists';
import App from '../../App';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);

// You would import the action from your codebase in a real scenario
function success() {
  return {
    type: 'FETCH_DATA_SUCCESS',
  };
}

function fetchData() {
  return (dispatch) => {
    return fetch('http://localhost:3001') // Some async action with promise
      .then(() => dispatch(success()));
  };
}

let store;
it('should execute fetch data', () => {
  store = mockStore({
    allLists: [{ title: 'test1' }, { title: 'test2' }],
    selectedList: [],
  });

  // Return the promise
  return store.dispatch(fetchData()).then(() => {
    console.log(store.getState());
    const actions = store.getActions();
    expect(actions[0]).toEqual(success());
  });
});

it('should render the fetched data', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const input = screen.getByPlaceholderText('Add List');
  userEvent.type(input, 'testList');
});
///////////////////////////////////////////////////////////
// jest.mock('../pathToService', () => ({
//   addTask: () => ({list: 'testList'})
// }));

// // write task
// it ('should write task', async () => {
//   render(
//     <Provider store={store}>
//       <AllList />
//     </Provider>);
// });
