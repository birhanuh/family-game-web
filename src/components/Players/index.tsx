import React, { PureComponent } from "react";
import { Card, List, Col, Row, Button } from 'antd';

class Players extends PureComponent {
  render() {
    const data = [
      {
        title: 'Title 1',
      },
      {
        title: 'Title 2',
      }
    ];

    return (
      <Row
        justify="center"
        className="players"
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <List
            grid={{
              gutter: 48,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 4,
            }}
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Card title={item.title} bordered={false}>
                  <p>Card content</p>

                  <Button type='primary' block={true} title='Load more' onClick={() => { }}> Button </Button>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    );
  }
}

export default Players;
