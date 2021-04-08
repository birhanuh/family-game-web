import React, { PureComponent } from "react";
import { Layout } from 'antd';

const { Footer } = Layout;

class FooterPage extends PureComponent {
  render() {
    return (
      <Footer>
        <div>Family game. ©2021</div>
      </Footer>
    );
  }
}

export default FooterPage;
