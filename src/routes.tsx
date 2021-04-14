import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';
import HeaderPage from "./components/Header";
import FooterPage from "./components/Footer";
import Games from "./components/Games";
import Game from "./components/Game";

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
            </Switch>
          </Content>
          <FooterPage />
        </Layout>
      </BrowserRouter>)
  }
}

export default App;
