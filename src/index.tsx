import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Routes from "./routes";

// CSS entry
import "./styles/app.css";

import store from './store';

ReactDOM.render(
  < Provider store={store} >
    <Routes />
  </Provider >, document.getElementById("root"));
