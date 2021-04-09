import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';
import HeaderPage from "./Header";
import FooterPage from "./Footer";
import Games from "./Games";
import Game from "./Game";
import Players from "./Players";

const { Content } = Layout;

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <HeaderPage />
          <Content>
            <Switch>
              <Route exact={true} path="/" component={Games} />
              <Route exact={true} path="/games" component={Games} />
              <Route exact={true} path="/games/:gameId" component={Game} />
              <Route exact={true} path="/players" component={Players} />
            </Switch>
          </Content>
          <FooterPage />
        </Layout>
      </BrowserRouter>)
  }
}

export default App;
