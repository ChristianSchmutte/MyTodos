import configureStore from 'redux-mock-store';

import thunk from 'redux-thunk';

import { render } from '@testing-library/react';

import { Provider } from 'react-redux';

import { screen } from '@testing-library/dom'

import App from '../../App';

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);

// You would import the action from your codebase in a real scenario
// function createLists(lists) {
//   return {
//     // type: 'FETCH_DATA_SUCCESS',
//     type: 'CREATE LISTS',
//     lists,
//   };
// }
// const store = mockStore({
//   allLists: {
//     lists: [{ title: 'test1' }, { title: 'test2' }],
//   },
//   selectedList: [],
// });

// function fetchData() {
//   return (dispatch) => fetch('http://localhost:3001') // http://localhost:3001/users/608a93e283f0c82f9facbd6f/lists
//     .then(() => dispatch(createLists(store.getState())));
// }

describe('front end test to render redux mock data', () => {
  const store = mockStore({
      allLists: {
        lists: [{ title: 'test1' }, { title: 'test2' }],
      },
      selectedList: [],
    });
    it('should execute fetch data', () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
      const input = screen.getByText('test2');
      expect(input.innerHTML).toBe('test2');
    });

  // it('should execute fetch data', () => store.dispatch(fetchData()).then(() => {
  //   console.log(store.getState());
  //   const actions = store.getActions();
  //   expect(actions[0]).toEqual(createLists(store.getState()));
  // }));
});