// import dependencies
import "./matchMedia.mock";
import React from "react";
import { withRouter } from "react-router";
import { Link, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import {createStore} from 'redux'
import {Provider, connect} from 'react-redux'

// import react-testing methods
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";

// add custom jest matchers from jest-dom
import "jest-dom/extend-expect";

// the axios mock is in __mocks__/
// see https://jestjs.io/docs/en/manual-mocks
import axiosMock from "axios";

// the component to test
import Home from "../components/Home/Home";
import App from "../App-testing";
import Clubs from "../components/Clubs/Clubs";

afterEach(cleanup);

// this is a handy function that I would utilize for any component
// that relies on the router being in context
function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  } = {}
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}

// this is a handy function that I normally make available for all my tests
// that deal with connected components.
// you can provide initialState or the entire store that the ui is rendered with
function reducer(state = {count: 0}, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1,
      }
    case 'DECREMENT':
      return {
        count: state.count - 1,
      }
    default:
      return state
  }
}

function renderWithRedux(
  ui,
  {initialState, store = createStore(reducer, initialState)} = {},
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}


// call with "DEBUG_PRINT_LIMIT=10 npm test" to lower DOM debug
// window.matchMedia = () => {};

    // window.matchMedia = jest.fn().mockImplementation(query => {
    //   return {
    //     matches: false,
    //     media: query,
    //     onchange: null,
    //     addListener: jest.fn(),
    //     removeListener: jest.fn()
    //   };
    // });

// window.matchMedia = {
//   matches: false, // <-- Set according to what you want to test
//   addListener: () => {},
//   removeListener: () => {}
// }

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };


describe("Home Component", () => {
  // global.window.matchMedia = jest.fn(() => {
  //   return {
  //     matches: false,
  //     addListener: jest.fn(),
  //     removeListener: jest.fn()
  //   };
  // });

    // global.window.matchMedia = jest.fn().mockImplementation(query => {
    //   return {
    //     matches: false,
    //     media: query,
    //     onchange: null,
    //     addListener: jest.fn(),
    //     removeListener: jest.fn()
    //   };
    // });

  // beforeAll(() => {
  //   window.matchMedia = jest.fn().mockImplementation(query => {
  //     return {
  //       matches: false,
  //       media: query,
  //       onchange: null,
  //       addListener: jest.fn(),
  //       removeListener: jest.fn()
  //     };
  //   });
  // });

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      })
    });
  });

  it("displays properly", () => {
    const { getByText, getByTestId } = renderWithRouter(<Home />);
    getByText("SHOP");
    getByText("ABOUT");
    getByText("CLUBS");
    getByText("An E-Commerce Website for Clubs at UC Davis");
  });

  // test("links to about page", () => {
  //   const { getByText } = render(<App />);
  //   getByText("ABOUT");
  // });

  it("This test should fail.", () => {
    const { getByText } = renderWithRouter(<Home />);
    getByText("FAIL");
  });
});

describe("Clubs Component", () => {
  it("displays properly", () => {
    const { getByText } = renderWithRouter(<Clubs />);
    getByText('CLUBS')


  })
})
