import React, { PureComponent } from "react";
import { List, Card, Button, Typography, Col, Row, Tag } from 'antd';
import { PlayCircleOutlined, PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

class Games extends PureComponent {
  render() {
    const data = [
      {
        id: 1,
        title: 'Game 1',
      },
      {
        id: 2,
        title: 'Game 2',
      }
    ];

    return (
      <>
        <Row justify="center"
          className="games-heading"
          style={{ marginTop: 40, textAlign: 'center' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <Title level={3}>Ipsum is simply dummy text of the printing and typesetting industry.</Title>
            <Button type='primary' size="large" onClick={() => { }}><PlusCircleOutlined />Create game</Button>
          </Col>
        </Row>
        <Row
          justify="center"
          className="games-items"
          style={{ marginTop: 40 }}
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
                      <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ padding: 12 }}>
                        <div className="questions-section">
                          <div className="tags">
                            <Tag>Question 1</Tag>
                            <Tag>Question 1</Tag>
                            <Tag>Question 1</Tag>
                          </div>
                          <Button type='primary' size='small' onClick={() => { }}><UserAddOutlined /> Add player</Button>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ padding: 12 }}>
                        <div className="players-section">
                          <div className="tags">
                            <Tag>Player 1</Tag>
                            <Tag>Player 1</Tag>
                            <Tag>Player 1</Tag>
                          </div>
                          <Button type='primary' size='small' onClick={() => { }}><UserAddOutlined /> Add player</Button>
                        </div>
                      </Col>
                    </Row>
                    <Row justify='center'>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ padding: 12 }}>
                        <Link to={`games/${item.id}`} className='ant-btn ant-btn-block play-btn'><PlayCircleOutlined /><span>{`Play ${item.title}`}</span></Link>
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
