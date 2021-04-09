import React, { PureComponent } from "react";
import { Form, Input, List, Card, Button, Typography, Col, Row, Tag, Modal } from 'antd';
import { CheckCircleOutlined, FileUnknownOutlined, PlayCircleOutlined, PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getGames, createGame } from '../../actions/game'
import { addPlayer } from '../../actions/player'
import { addQuestion } from '../../actions/question'

const { Title } = Typography;

interface State {
  title: string;
  player: {
    name: string;
  };
  question: {
    title: string;
  };
  isTitleModalVisible: boolean,
  isPlayerModalVisible: boolean,
  isQuestionModalVisible: boolean
}

class Games extends PureComponent<{}, State> {
  state = {
    title: '',
    player: {
      name: ''
    },
    question: {
      title: ''
    },
    isTitleModalVisible: false,
    isPlayerModalVisible: false,
    isQuestionModalVisible: false
  }

  // Title
  handleTitle = () => {
    this.setState(({
      isTitleModalVisible: true
    }));
  };

  handleOkTitle = () => {
    this.setState(({
      isTitleModalVisible: false
    }));
  };

  handleCancelTitle = () => {
    this.setState(({
      isTitleModalVisible: false
    }));
  };

  onTitleFinish = (values: any) => {
    console.log('Success:', values);
  };

  onTitleFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Player
  handlePlayer = () => {
    this.setState(({
      isPlayerModalVisible: true
    }));
  };

  handleOkPlayer = () => {
    this.setState(({
      isPlayerModalVisible: false
    }));
  };

  handleCancelPlayer = () => {
    this.setState(({
      isPlayerModalVisible: false
    }));
  };

  onPlayerFinish = (values: any) => {
    console.log('Success:', values);
  };

  onPlayerFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Question
  handleQuestion = () => {
    this.setState(({
      isQuestionModalVisible: true
    }));
  };

  handleOkQuestion = () => {
    this.setState(({
      isQuestionModalVisible: false
    }));
  };

  handleCancelQuestion = () => {
    this.setState(({
      isQuestionModalVisible: false
    }));
  };

  onQuestionFinish = (values: any) => {
    console.log('Success:', values);
  };

  onQuestionFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { title, player: { name }, question: { title: questionTitle }, isTitleModalVisible, isPlayerModalVisible, isQuestionModalVisible } = this.state;

    const games = [
      {
        id: 1,
        title: 'Game 1',
      },
      {
        id: 2,
        title: 'Game 2',
      }
    ];

    const players = [
      {
        id: 1,
        name: 'Player 1',
      },
      {
        id: 2,
        name: 'Player 2',
      }
    ];

    const questions = [
      {
        id: 1,
        title: 'Question 1',
      },
      {
        id: 2,
        title: 'Question 2',
      }
    ];

    return (
      <>
        <Row justify="center"
          className="games-heading"
          style={{ marginTop: 40, textAlign: 'center' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <Title level={3}>Ipsum is simply dummy text of the printing and typesetting industry.</Title>
            <Button type='primary' size="large" onClick={() => this.handleTitle()}><PlusCircleOutlined />Create game</Button>
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
              dataSource={games}
              renderItem={item => (
                <List.Item>
                  <Card title={item.title} bordered={false}>
                    <Row>
                      <Col xs={24} sm={24} md={16} lg={16} xl={16} style={{ padding: 12 }}>
                        <div className="questions-section">
                          <div className="tags">
                            {questions.map(question => <Tag key={question.id}>{question.title}</Tag>)}
                          </div>
                          <Button type='primary' size='small' className='add-question-btn' onClick={() => this.handleQuestion()}><FileUnknownOutlined />Add question</Button>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ padding: 12 }}>
                        <div className="players-section">
                          <div className="tags">
                            {players.map(player => <Tag key={player.id}>{player.name}</Tag>)}
                          </div>
                          <Button type='primary' size='small' className='add-player-btn' onClick={() => this.handlePlayer()}><UserAddOutlined />Add player</Button>
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
        {/* Game modal */}
        <Modal title="Enter game title" visible={isTitleModalVisible} onOk={this.handleOkTitle} onCancel={this.handleCancelTitle} okText="Ready">
          <Form
            layout="vertical"
            initialValues={{ title }}
            onFinish={this.onTitleFinish}
            onFinishFailed={this.onTitleFinishFailed}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input game title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit"><CheckCircleOutlined />Save</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Player modal */}
        <Modal title="Enter player" visible={isPlayerModalVisible} onOk={this.handleOkPlayer} onCancel={this.handleCancelPlayer} okText="Ready">
          {players.map(player => <Tag key={player.id}>{player.name}</Tag>)}
          <Form
            layout="vertical"
            initialValues={{ name }}
            onFinish={this.onPlayerFinish}
            onFinishFailed={this.onPlayerFinishFailed}
            style={{ marginTop: 20 }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input player name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit"><CheckCircleOutlined />Save</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Question modal */}
        <Modal title="Enter question" visible={isQuestionModalVisible} onOk={this.handleOkQuestion} onCancel={this.handleCancelQuestion} okText="Ready">
          {questions.map(question => <Tag key={question.id}>{question.title}</Tag>)}
          <Form
            layout="vertical"
            initialValues={{ title: questionTitle }}
            onFinish={this.onQuestionFinish}
            onFinishFailed={this.onQuestionFinishFailed}
            style={{ marginTop: 20 }}
          >
            <Form.Item
              label="Question"
              name="question"
              rules={[{ required: true, message: 'Please input question!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit"><CheckCircleOutlined />Save</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    games: state.games
  }
}

export default connect(mapStateToProps, { getGames, createGame, addPlayer, addQuestion })(Games);