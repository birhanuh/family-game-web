import { createStore } from "redux";

import rootReducer from "./reducers/rootReducer";

export default createStore(
  rootReducer, /* preloadedState, */
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);