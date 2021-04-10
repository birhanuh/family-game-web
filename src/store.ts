import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "./reducers/rootReducer";

export default createStore(
  rootReducer, /* preloadedState, */
  composeWithDevTools(applyMiddleware(thunk))
);

