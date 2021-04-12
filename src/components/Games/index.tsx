import React, { PureComponent } from "react";
import { Form, Input, List, Card, Button, Typography, Col, Row, Tag, Modal, Alert, Badge } from 'antd';
import { CheckCircleOutlined, FileUnknownOutlined, PlayCircleOutlined, PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getGames, createGame, addPlayer, addQuestion, deletePlayer, deleteQuestion } from '../../actions/game'
import { DeletePlayerProp, DeleteQuestionProp, GameProp, PlayerProp, QuestionProp } from "../../actions/types";
import classnames from "classnames";

const { Title } = Typography;

interface State {
  currentGame: GameProp;
  isGameModalVisible: boolean;
  isPlayerModalVisible: boolean;
  isQuestionModalVisible: boolean;
  isSubmitting: boolean;
}

interface Props {
  getGames: () => Promise<void>;
  createGame: (game: GameProp) => Promise<void>;
  addPlayer: (player: PlayerProp) => Promise<void>;
  addQuestion: (question: QuestionProp) => Promise<void>;
  deletePlayer: (player: DeletePlayerProp) => Promise<void>;
  deleteQuestion: (question: DeleteQuestionProp) => Promise<void>;
  games: [GameProp];
}

class Games extends PureComponent<Props, State> {
  state = {
    currentGame: { gameId: '', title: '', winner: { playerId: '', name: '', score: 0 }, players: [{ playerId: '', name: '', score: 0 }], questions: [{ questionId: '', question: '', isAsked: false }] },
    isGameModalVisible: false,
    isPlayerModalVisible: false,
    isQuestionModalVisible: false,
    isSubmitting: false
  }

  componentDidMount() {
    this.props.getGames();
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    if (nextProps.games) {
      const { games } = nextProps;

      games.map((game: GameProp) => {
        if (game.gameId === this.state.currentGame.gameId) {
          this.setState(({
            currentGame: game
          }));
        }
      });
    }
  }

  // Game
  handleGame = () => {
    this.setState(({
      isGameModalVisible: true
    }));
  };

  handleCancelGame = () => {
    this.setState(({
      isGameModalVisible: false
    }));
  };

  onGameFinish = (values: any) => {
    console.log('Success:', values);

    this.setState(({
      isSubmitting: true
    }));

    this.props.createGame(values);

    this.setState(({
      isGameModalVisible: false,
      isSubmitting: false
    }));

    // this.props.form.resetFields()
  };

  onGameFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // Player
  handlePlayer = (game: GameProp) => {
    this.setState(({
      currentGame: game,
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

  onPlayerFinish = (values: any, gameId: string) => {
    console.log('Success:', values, gameId);

    this.setState(({
      isSubmitting: true
    }));

    this.props.addPlayer({ ...values, gameId });

    this.setState(({
      isSubmitting: false
    }));
  };

  onPlayerFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  deletePlayer = (player: DeletePlayerProp) => {
    console.log('Id:', player);

    this.props.deletePlayer(player);
  };

  // Question
  handleQuestion = (game: GameProp) => {
    this.setState(({
      currentGame: game,
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

  onQuestionFinish = (values: any, gameId: string) => {
    console.log('Success:', values);

    this.setState(({
      isSubmitting: true
    }));

    this.props.addQuestion({ ...values, gameId });

    this.setState(({
      isSubmitting: false
    }));
  };

  onQuestionFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  deleteQuestion = (question: DeleteQuestionProp) => {
    console.log('Id:', question);

    this.props.deleteQuestion(question);
  };

  render() {
    const { currentGame, isGameModalVisible, isPlayerModalVisible, isQuestionModalVisible, isSubmitting } = this.state;

    const { games } = this.props;

    const EmptyListAlert = () => (<Alert
      style={{ marginTop: 20, marginBottom: 20 }}
      message="Currently here are no games yet"
      description="Currently here are no games yet"
      type="info"
      showIcon={true}
    />)

    return (
      <>
        <Row justify="center"
          className="games-heading"
          style={{ textAlign: 'center' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            <Title level={3}>Welcom to FamilyGames! Create game by clicking the "Create game" button bellow.</Title>
            <Button type='primary' size="large" onClick={() => this.handleGame()}><PlusCircleOutlined />Create game</Button>
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
              loading={!games}
              locale={{ emptyText: <EmptyListAlert /> }}
              dataSource={games}
              renderItem={(item: GameProp) => (
                <List.Item>
                  <Badge.Ribbon className={classnames("seconds", {
                    "no-winner": Object.keys(item.winner).length == 0
                  })} text={Object.keys(item.winner).length > 0 ? 'Winner: ' + item.winner.name : ''}>
                    <Card title={item.title} bordered={false}>
                      {(item.players.length > item.questions.length && <Alert
                        message="Number of Players should not be more than Questions"
                        type="error"
                        showIcon={true}
                      />) || (item.players.length === 0 && item.questions.length === 0 && <Alert
                        message="Add Players and Questions to start playing"
                        type="error"
                        showIcon={true}
                      />) || (item.questions.length % item.players.length !== 0 && <Alert
                        message="Number of Questions needs to be equally divided with number of Player"
                        type="error"
                        showIcon={true}
                      />)}
                      <Row>
                        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                          <div className="questions-section">
                            <div className="tags">
                              {item.questions.map(question => <Tag key={question.questionId} closable={true} onClose={() => this.deleteQuestion({ gameId: item.gameId, questionId: question.questionId })}>{question.question}</Tag>)}
                            </div>
                            <Button type='primary' size='small' className='add-question-btn' disabled={isSubmitting} onClick={() => this.handleQuestion(item)}><FileUnknownOutlined />Add question</Button>
                          </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <div className="players-section">
                            <div className="tags">
                              {item.players.map(player => <Tag key={player.playerId} closable={true} onClose={() => this.deletePlayer({ gameId: item.gameId, playerId: player.playerId })}>{player.name}</Tag>)}
                            </div>
                            <Button type='primary' size='small' className='add-player-btn' disabled={isSubmitting} onClick={() => this.handlePlayer(item)}><UserAddOutlined />Add player</Button>
                          </div>
                        </Col>
                      </Row>
                      <Row justify='center'>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Link className={classnames("ant-btn ant-btn-block play-btn", {
                            "disabled": (item.players.length > item.questions.length) || (item.players.length === 0 && item.questions.length === 0) || (item.questions.length % item.players.length !== 0)
                          })}
                            to={(item.players.length > item.questions.length) || (item.players.length === 0 && item.questions.length === 0) || (item.questions.length % item.players.length !== 0) ? '' :
                              `games/${item.gameId}`} ><PlayCircleOutlined /><span>{`Play ${item.title}`}</span></Link>
                        </Col>
                      </Row>
                    </Card>
                  </Badge.Ribbon>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        {/* Game modal */}
        <Modal title="Enter game title" visible={isGameModalVisible} onCancel={this.handleCancelGame} footer={false}>
          <Form
            layout="vertical"
            onFinish={this.onGameFinish}
            onFinishFailed={this.onGameFinishFailed}
          >
            <Form.Item
              label="Game"
              name="title"
              rules={[{ required: true, message: 'Please input game title!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}><CheckCircleOutlined />Save</Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* Player modal */}
        <Modal title="Enter player" visible={isPlayerModalVisible} onOk={this.handleOkPlayer} onCancel={this.handleCancelPlayer} footer={false}>
          {currentGame.players.map(player => <Tag key={player.playerId} closable={true} onClose={() => this.deletePlayer({ gameId: currentGame.gameId, playerId: player.playerId })}>{player.name}</Tag>)}
          <Form
            layout="vertical"
            onFinish={(value) => this.onPlayerFinish(value, currentGame.gameId)}
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
              <Button type="primary" htmlType="submit" disabled={isSubmitting}><CheckCircleOutlined />Save</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Question modal */}
        <Modal title="Enter question" visible={isQuestionModalVisible} onOk={this.handleOkQuestion} onCancel={this.handleCancelQuestion} footer={false}>
          {currentGame.questions.map(question => <Tag key={question.questionId} closable={true} onClose={() => this.deleteQuestion({ gameId: currentGame.gameId, questionId: question.questionId })}>{question.question}</Tag>)}
          <Form
            layout="vertical"
            onFinish={(value) => this.onQuestionFinish(value, currentGame.gameId)}
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
              <Button type="primary" htmlType="submit" disabled={isSubmitting}><CheckCircleOutlined />Save</Button>
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

export default connect(mapStateToProps, { getGames, createGame, addPlayer, addQuestion, deletePlayer, deleteQuestion })(Games);