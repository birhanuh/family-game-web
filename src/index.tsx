import React from "react";
import { Container, createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import Routes from "./routes";

// CSS entry
import "./styles/app.css";

import { store } from './store';

const root = createRoot(document.getElementById('root') as Container);

root.render(
  <Provider store={store} >
    <Routes />
  </Provider >
);
