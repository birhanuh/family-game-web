import React, { PureComponent } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import classnames from "classnames";
import { Menu, Layout } from "antd";
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

class HeaderPage extends PureComponent<RouteComponentProps> {
  render() {
    return (
      <Header className={classnames('header', {
        "games": this.props.location.pathname === '/'
      })}>
        <Link to="/">
          <div className="logo" />
        </Link>
        <Menu mode="horizontal">
          <Menu.Item key="games">
            <PlayCircleOutlined key="games" />
            <Link to="/">Games</Link>
          </Menu.Item>
          <Menu.Item key="players">
            <UserOutlined key="players" />
            <Link to="/players">Players</Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderPage);
