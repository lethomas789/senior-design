// import dependencies
import "./matchMedia.mock";
import React from "react";
import { withRouter, StaticRouter } from "react-router";
import { Link, Route, Router, Switch, MemoryRouter } from "react-router-dom";
import { createMemoryHistory } from "history";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { create } from "react-test-renderer";
import axios from "axios";

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

jest.mock("axios");

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
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        count: state.count + 1
      };
    case "DECREMENT":
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store
  };
}

// call with "DEBUG_PRINT_LIMIT=10 npm test" to lower DOM debug

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

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => {
        return {
          matches: false,
          addListener: jest.fn(),
          removeListener: jest.fn()
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
    getByText("This text does not exist on the screen.");
  });
});

describe("Clubs Component", () => {
  it("displays properly", async () => {
    // const { getByText } = renderWithRouter(<Clubs />);
    const response = {
      data: {
        success: true,
        vendors: [
          {
            vendorName: "WICS",
            bioPictures: [
              "https://firebasestorage.googleapis.com/v0/b/ecs193-ecommerce.appspot.com/o/test-club-2.jpg?alt=media&token=13ba901a-302b-402e-b749-1a291f410d92"
            ]
          }
        ]
      }
    };

    axios.get.mockResolvedValue(response);
    const component = create(
        <Clubs />
    );

    const instance = component.getInstance();
    // console.log(instance);
    await instance.componentDidMount();
    console.log(instance.state);
    // console.log(component.root);
    const rootInstance = component.root;
    console.log(rootInstance);

    expect(rootInstance.findAllByType("img").props.src).toBe(
      response.data.vendors[0].bioPictures[0]
    );

    // expect(
    //   rootInstance.findByProps({ className: "hero-textt" }).children
    // ).toEqual([response.data.vendors[0].vendorName]);
  });
});





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