import React, { PureComponent } from "react";
import { Button, Card, Col, Row, List, Typography } from 'antd';
import { PlayCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface State {
  seconds: number;
}

class Game extends PureComponent<{}, State> {
  state = {
    seconds: 30
  }

  render() {
    const { seconds } = this.state;

    const questions = [
      {
        title: 'Question 1',
        isAsked: false
      },
      {
        title: 'Question 2',
        isAsked: false
      }
    ];

    const players = [
      {
        name: 'Player 1',
        score: 0
      },
      {
        name: 'Player 2',
        score: 0
      }
    ];

    return (
      <>
        <Row
          justify="center"
          style={{ display: 'flex', marginTop: 40, textAlign: 'center' }}
        >
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            <Title>{questions[0].title}</Title>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
            <Title level={2} className='score'>{seconds}</Title>
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ marginTop: 40 }}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <List
              grid={{
                gutter: 48,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              className='player-items'
              split={true}
              style={{ textAlign: 'center' }}
              dataSource={players}
              renderItem={item => (
                <List.Item style={{ margin: 'auto' }}>
                  <Card title={item.name} bordered={false}>
                    <h2>{item.score}</h2>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ marginTop: 60 }}
        >
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Button type='primary' size='large' className='start-btn' block={true} onClick={() => { }}><PlayCircleOutlined />Start</Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default Game;