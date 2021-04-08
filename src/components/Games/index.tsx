import React, { PureComponent } from "react";
import { List, Card, Button, Typography, Col, Row } from 'antd';
import { PlayCircleOutlined, PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

class Games extends PureComponent {
  render() {
    const data = [
      {
        title: 'Game 1',
      },
      {
        title: 'Game 2',
      }
    ];

    return (
      <>
        <Row justify="center"
          className="games-heading">
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <Title level={3}>Ipsum is simply dummy text of the printing and typesetting industry.</Title>
            <Button type='primary' size="large" onClick={() => { }}><PlusCircleOutlined />Create game</Button>
          </Col>
        </Row>
        <Row
          justify="center"
          className="games-item"
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <List
              grid={{
                gutter: 48,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
              }}
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <Card title={item.title} bordered={false}>
                    <Row>
                      <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                        <p>Questions</p>
                        <Button type='dashed' onClick={() => { }}><UserAddOutlined /> Add player</Button>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <p>Players</p>
                        <Button type='dashed' onClick={() => { }}><UserAddOutlined /> Add player</Button>
                      </Col>
                      <Col xs={24} sm={24} md={2} lg={2} xl={2}>
                        <Button type="primary" block={true} onClick={() => { }}><PlayCircleOutlined />Play</Button>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default Games;
