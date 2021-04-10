import React, { PureComponent } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import classnames from "classnames";
import { Menu, Layout } from "antd";
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

class HeaderPage extends PureComponent<RouteComponentProps> {
  render() {
    return (
      <Header>
        <Link to="/">
          <div className="logo" />
        </Link>
        <Menu mode="horizontal">
          <Menu.Item key="games" className={classnames({
            "ant-menu-item-selected": this.props.location.pathname === '/' || this.props.location.pathname.startsWith('/games')
          })} >
            <PlayCircleOutlined key="games" />
            <Link to="/">Games</Link>
          </Menu.Item>
          <Menu.Item key="players" className={classnames({ "ant-menu-item-selected": this.props.location.pathname.startsWith('/players') })} >
            <UserOutlined key="players" />
            <Link to="/players">Players</Link>
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

export default withRouter(HeaderPage);
