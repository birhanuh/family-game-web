import React, { useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  List,
  Card,
  Button,
  Typography,
  Col,
  Row,
  Tag,
  Modal,
  Alert,
  Badge,
  Space,
} from 'antd';
import {
  CloseOutlined,
  FileUnknownOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { getGames, createGame, addPlayer, addQuestion, deletePlayer, deleteQuestion } from '../../actions/games';
import { DeletePlayerProp, DeleteQuestionProp, GameProp, PlayerProp, QuestionProp } from '../../actions/types';
import classnames from 'classnames';

const { Title } = Typography;

interface GamesProps {
  currentGame: GameProp;
  isGameModalVisible: boolean;
  isPlayerModalVisible: boolean;
  isQuestionModalVisible: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
}

interface DispatchProps {
  getGames: () => Promise<void>;
  createGame: (game: GameProp) => Promise<void>;
  addPlayer: (player: PlayerProp) => Promise<void>;
  addQuestion: (question: QuestionProp) => Promise<void>;
  deletePlayer: (player: DeletePlayerProp) => Promise<void>;
  deleteQuestion: (question: DeleteQuestionProp) => Promise<void>;
}

interface StateProps {
  games: [GameProp];
}

const Games = ({ games, getGames, createGame, addPlayer, addQuestion, deletePlayer, deleteQuestion }: StateProps & DispatchProps) => { 
  const navigate = useNavigate();

  const [gamesState, setGamesState] = useState<GamesProps>({
    currentGame: {
      gameId: '',
      title: '',
      winner: { playerId: '', name: '', score: 0 },
      players: [{ playerId: '', name: '', score: 0 }],
      questions: [{ questionId: '', question: '', isAsked: false }],
    },
    isGameModalVisible: false,
    isPlayerModalVisible: false,
    isQuestionModalVisible: false,
    isSubmitting: false,
    isLoading: true,
  });

  const formRef = useRef<any | undefined>(null);
  
  useEffect(() => {
    getGames().then(() => setGamesState({
      ...gamesState,
      isLoading: false,
    }));
  }, []);

  // Game
  const handleOpenAddGameModal = () => {
    setGamesState(prev => ({
      ...gamesState,
      isGameModalVisible: !prev.isGameModalVisible,
    }));
  };

  const onGameFinish = (values: GameProp) => {
    setGamesState({
      ...gamesState,
      isSubmitting: true,
    });

    createGame(values);

    // @ts-ignore
    formRef.current.resetFields();

    setGamesState({
      ...gamesState,
      isGameModalVisible: false,
      isSubmitting: false,
    });
  };

  // Player
  const handleOpenAddPlayerModal = () => {
    setGamesState(prev =>({
      ...gamesState,
      isPlayerModalVisible: !prev.isPlayerModalVisible,
    }));
  };

  const handleAddPlayer = (gm: GameProp) => {
    setGamesState({
      ...gamesState,
      currentGame: gm,
      isPlayerModalVisible: true,
    });
  };

  const onPlayerFinish = (values: PlayerProp, gameId: string) => {
    setGamesState({
      ...gamesState,
      currentGame: { ...gamesState.currentGame, players: [...gamesState.currentGame.players, values]},
      isSubmitting: true,
    });

    addPlayer({ ...values, gameId });

    // @ts-ignore
    formRef.current.resetFields();

    setGamesState({
      ...gamesState,
      currentGame: { ...gamesState.currentGame, players: [...gamesState.currentGame.players, values]},
      isSubmitting: false,
    });
  };

  // Question
  const handleOpenAddQuestionModal = () => {
    setGamesState(prev =>({
      ...gamesState,
      isQuestionModalVisible: !prev.isQuestionModalVisible,
    }));
  };

  const handleAddQuestion = (gm: GameProp) => {
    setGamesState({
      ...gamesState,
      currentGame: gm,
      isQuestionModalVisible: true,
    });
  };

  const onQuestionFinish = (values: QuestionProp, gameId: string) => {
    setGamesState({
      ...gamesState,
      currentGame: { ...gamesState.currentGame, questions: [...gamesState.currentGame.questions, values]},
      isSubmitting: true,
    });

    addQuestion({ ...values, gameId });

    // @ts-ignore
    formRef.current.resetFields();

    setGamesState({
      ...gamesState,
      currentGame: { ...gamesState.currentGame, questions: [...gamesState.currentGame.questions, values]},
      isSubmitting: false,
    });
  };

  const onPlayerFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onQuestionFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onGameFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleOnClick = (item: GameProp) => {
    navigate( `games/${item.gameId}`)
  };

  const { currentGame, isGameModalVisible, isPlayerModalVisible, isQuestionModalVisible, isSubmitting, isLoading } = gamesState;

  const EmptyListAlert = () => (
    <Alert
      style={{ marginTop: 20, marginBottom: 20 }}
      message="Tällä hetkellä ei ole näytettäviä pelejä"
      description="Tällä hetkellä ei ole näytettäviä pelejä"
      type="info"
      showIcon={true}
    />
  );

  return (
    <>
      <Row justify="center" className="games-heading" style={{ textAlign: 'center' }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <Title level={3}>Tervetuloa Family gamin! Luo peli napsauttamalla "Luo peli" -painiketta.</Title>
          <Button type="primary" size="large" onClick={handleOpenAddGameModal}>
            <PlusCircleOutlined />
            Luo peli
          </Button>
        </Col>
      </Row>
      <Row justify="center" className="games-items" style={{ marginTop: 40 }}>
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
            loading={isLoading}
            locale={{ emptyText: <EmptyListAlert /> }}
            dataSource={games}
            renderItem={(item: GameProp) => (
              <List.Item>
                <Badge.Ribbon
                  className={classnames('seconds', {
                    'no-winner': Object.keys(item.winner).length == 0,
                  })}
                  text={Object.keys(item.winner).length > 0 ? 'Winner: ' + item.winner.name : ''}
                >
                  <Card title={item.title}>
                    {(item.players.length > item.questions.length && (
                      <Alert
                        message="Number of Players should not be more than Questions"
                        type="error"
                        showIcon={true}
                      />
                    )) ||
                      (item.players.length === 0 && item.questions.length === 0 && (
                        <Alert
                          message="Lisää pelaajia ja kysymyksiä aloittaaksesi pelaamisen"
                          type="error"
                          showIcon={true}
                        />
                      )) ||
                      (item.questions.length % item.players.length !== 0 && (
                        <Alert
                          message="Kysymysten määrä on jaettava tasan pelaajan lukumäärään"
                          type="error"
                          showIcon={true}
                        />
                      ))}
                    <Row>
                      <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <div className="questions-section">
                          <div className="tags">
                            {item.questions.map((question) => (
                              <Tag
                                key={`${question.questionId}-q`}
                                closable={true}
                                onClose={() =>
                                  deleteQuestion({ gameId: item.gameId, questionId: question.questionId })
                                }
                              >
                                <div className="ant-tag-question">{question.question}</div>
                              </Tag>
                            ))}
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            disabled={isSubmitting}
                            onClick={() => handleAddQuestion(item)}
                          >
                            <FileUnknownOutlined />
                            Lisää kysymys
                          </Button>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div className="players-section">
                          <div className="tags">
                            {item.players.map((player) => (
                              <Tag
                                key={`${player.playerId}-q`}
                                closable={true}
                                onClose={() => deletePlayer({ gameId: item.gameId, playerId: player.playerId })}
                              >
                                {player.name}
                              </Tag>
                            ))}
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            disabled={isSubmitting}
                            onClick={() => handleAddPlayer(item)}
                          >
                            <UsergroupAddOutlined />
                            Lisää pelaaja tai tiimi
                          </Button>
                        </div>
                      </Col>
                    </Row>
                    <Row justify="center">
                      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Button
                        block
                        type='default'
                        disabled={ item.players.length > item.questions.length ||
                          (item.players.length === 0 && item.questions.length === 0) ||
                          item.questions.length % item.players.length !== 0}
                          onClick={() => handleOnClick(item)}
                        >
                          <PlayCircleOutlined />
                          <span>{`Play ${item.title}`}</span>
                        </Button>
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
      <Modal title="Enter game title" open={isGameModalVisible} onCancel={handleOpenAddGameModal} footer={false}>
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onGameFinish}
          onFinishFailed={onGameFinishFailed}
        >
          <Form.Item label="Game" name="title" rules={[{ required: true, message: 'Please input game title!' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Space wrap>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                <PlusCircleOutlined />
                Add
              </Button>
              <Button type="text" disabled={isSubmitting} onClick={handleOpenAddGameModal}>
                <CloseOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Player modal */}
      <Modal
        title="Enter player"
        open={isPlayerModalVisible}
        onOk={handleOpenAddPlayerModal}
        onCancel={handleOpenAddPlayerModal}
        footer={false}
      >
        {currentGame.players.map((player) => (
          <Tag
            key={`${player.playerId}-p2`}
            closable={true}
            onClose={() => deletePlayer({ gameId: currentGame.gameId, playerId: player.playerId })}
          >
            {player.name}
          </Tag>
        ))}
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={(value) => onPlayerFinish(value, currentGame.gameId)}
          onFinishFailed={onPlayerFinishFailed}
          style={{ marginTop: 20 }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input player name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Space wrap>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                <PlusCircleOutlined />
                Add
              </Button>
              <Button type="text" disabled={isSubmitting} onClick={handleOpenAddPlayerModal}>
                <CloseOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Question modal */}
      <Modal
        title="Enter question"
        open={isQuestionModalVisible}
        onOk={handleOpenAddQuestionModal}
        onCancel={handleOpenAddQuestionModal}
        footer={false}
      >
        {currentGame.questions.map((question) => (
          <Tag
            key={`${question.questionId}-q2`}
            className={question.questionId}
            closable={true}
            onClose={() => deleteQuestion({ gameId: currentGame.gameId, questionId: question.questionId })}
          >
            {question.question}
          </Tag>
        ))}
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={(value) => onQuestionFinish(value, currentGame.gameId)}
          onFinishFailed={onQuestionFinishFailed}
          style={{ marginTop: 20 }}
        >
          <Form.Item label="Question" name="question" rules={[{ required: true, message: 'Please input question!' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Space wrap>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                <PlusCircleOutlined />
                Add
              </Button>
              <Button type="text" disabled={isSubmitting} onClick={handleOpenAddQuestionModal}>
                <CloseOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    games: state.games,
  };
}

export default connect<StateProps, DispatchProps>(mapStateToProps, { getGames , createGame, addPlayer, addQuestion, deletePlayer, deleteQuestion } as any)(
  Games
);
