import React, { PureComponent } from "react";
import { Button, Card, Col, Row, List, Typography, Modal, Divider, Alert } from 'antd';
import { CheckOutlined, CloseOutlined, MinusCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { GameProp, PlayerProp, QuestionProp, UpdateGameProp } from "../../actions/types";
import { getGame } from '../../actions/game'
import { updateGame, updatePlayer, updateQuestion, resetGame } from '../../actions/game'
import { RouteComponentProps } from "react-router";
import classnames from "classnames";

const cling = require('../../audios/cling.mp3');
const clingAudio = new Audio(cling);

const { Title } = Typography;

interface State {
  seconds: number;
  isGameActive: boolean;
  isGameOver: boolean;
  game: GameProp;
  currentQuestion: QuestionProp;
  currentPlayer: PlayerProp;
  winner: PlayerProp;
  isConfirmationModalVisible: boolean;
  nextPlayerIndex: number;
  noCurrentPlayerError: boolean;
}

interface MatchParams {
  gameId: string;
};

interface Props {
  getGame: (id: string) => Promise<void>;
  updateGame: (game: UpdateGameProp) => Promise<void>;
  updatePlayer: (player: PlayerProp) => Promise<void>;
  updateQuestion: (question: QuestionProp) => Promise<void>;
  resetGame: (id: string) => Promise<void>;
  game: GameProp;
}



class Game extends PureComponent<RouteComponentProps<MatchParams> & Props, State> {
  static countdown: any;

  state = {
    seconds: 30,
    isGameActive: false,
    isGameOver: false,
    game: { gameId: '', title: '', winner: { playerId: '', name: '', score: 0 }, players: [{ playerId: '', name: '', score: 0 }], questions: [{ questionId: '', question: '', isAsked: false }] },
    currentQuestion: { gameId: '', questionId: '', question: '', isAsked: false },
    currentPlayer: { gameId: '', playerId: '', name: '', score: 0 },
    winner: { gameId: '', playerId: '', name: '', score: 0 },
    isConfirmationModalVisible: false,
    nextPlayerIndex: 0,
    noCurrentPlayerError: false
  }

  componentDidMount = async () => {
    // Fetch Project when id is present in params
    const { match } = this.props

    if (match.params.gameId) {
      this.props.getGame(match.params.gameId);
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps: any) => {
    if (nextProps.game) {
      const { gameId, winner, title, players, questions } = nextProps.game;

      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);

      if (questionsFiltered.length === 0) {
        this.setState(({
          isGameOver: true
        }));

        if (Object.keys(winner).length === 0) {
          const winnerPlayer = players.reduce(function (prev: PlayerProp, current: PlayerProp) {
            return (prev.score > current.score) ? prev : current
          });

          this.props.updateGame({ gameId, title, winner: winnerPlayer });

          this.setState(({
            winner: winnerPlayer
          }));
        }
      }
    }
  }

  componentWillUnmount = () => {
    // Stop countdown
    clearInterval(Game.countdown);
  }

  handleReset = () => {
    const { gameId } = this.props.game;

    this.props.resetGame(gameId);

    // Active game back
    this.setState(({
      isGameOver: false
    }));
  }

  handleStart = () => {
    this.setState(({
      seconds: 30,
      isGameActive: true,
      noCurrentPlayerError: false
    }));

    let secondsCloned = 30;

    const { game: { gameId, players, questions } } = this.props;
    const { nextPlayerIndex } = this.state;

    // Pick current Player
    const currentPlayer = players[nextPlayerIndex] ? players[nextPlayerIndex] : players[0];

    this.setState(({
      currentPlayer: { gameId, ...currentPlayer },
      nextPlayerIndex: players.indexOf(currentPlayer) + 1
    }));

    const questionsFiltered = questions.filter(question => !question.isAsked);
    // Pick current Question
    const random = Math.floor(Math.random() * questionsFiltered.length);

    const currentQuestion = questionsFiltered[random];

    this.setState(({
      currentQuestion: { gameId, ...currentQuestion },
    }));

    // Start countdown
    Game.countdown = setInterval(() => {
      if (secondsCloned > 0) {
        this.setState((state: State) => ({
          seconds: state.seconds - 1
        }));

        secondsCloned = secondsCloned - 1;

        // Play audio
        if (secondsCloned < 6) {
          // cling
          clingAudio.play();
        }
      } else if (secondsCloned === 0) {
        this.handleConfirmationModal();

        secondsCloned = -1;
      }
    }, 1000);
  }

  // Confirmation
  handleConfirmationModal = () => {
    this.setState(({
      isConfirmationModalVisible: true
    }));
  };

  handleYes = () => {
    const { currentPlayer, currentQuestion } = this.state;

    this.props.updatePlayer({ ...currentPlayer, score: currentPlayer.score + 1 });

    this.props.updateQuestion({ ...currentQuestion, isAsked: true });

    this.setState(({
      isGameActive: false,
      isConfirmationModalVisible: false
    }));
  }

  handleNo = () => {
    const { currentQuestion } = this.state;

    this.props.updateQuestion({ ...currentQuestion, isAsked: true });

    this.setState(({
      isGameActive: false,
      isConfirmationModalVisible: false
    }));
  }

  handleEditScoreMinus = (passedPlayer: PlayerProp) => {
    const { game: { gameId } } = this.props;
    this.props.updatePlayer({ gameId, ...passedPlayer, score: passedPlayer.score - 1 });
  };

  handleEditScorePlus = () => {
    const { currentPlayer, currentQuestion } = this.state;

    if (currentPlayer.gameId.length !== 0) {
      // Stop countdown
      clearInterval(Game.countdown);

      this.setState(({
        seconds: 30,
        isGameActive: false,
      }));

      this.props.updatePlayer({ ...currentPlayer, score: currentPlayer.score + 1 });

      this.props.updateQuestion({ ...currentQuestion, isAsked: true });
    } else {
      this.setState(({
        noCurrentPlayerError: true,
      }));
    }
  };

  render() {
    const { seconds, currentPlayer: { playerId, name }, currentQuestion: { question }, winner, isGameActive, isGameOver, isConfirmationModalVisible, noCurrentPlayerError } = this.state;

    const { game } = this.props;

    return (
      <>
        <Row
          justify="center"
          style={{ display: 'flex', marginTop: 12, textAlign: 'right' }}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={20} className='reset-game'>
            <Button type='dashed' className='reset-btn' onClick={() => this.handleReset()}><RedoOutlined />Reset</Button>
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ display: 'flex', textAlign: 'center' }}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={20} className='question-seconds'>
            <Title>{question && question.length > 0 ? question : '--'}</Title>
            <Title level={2} className={classnames("seconds", {
              "orange": seconds < 6
            })}>{seconds}</Title>
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ marginTop: 40 }}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={20}>
            {noCurrentPlayerError && <Alert
              message="No active Player found"
              type="error"
              showIcon={true}
            />}
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
              dataSource={game && game.players}
              renderItem={(item: PlayerProp) => (
                <List.Item style={{ margin: 'auto' }}>
                  <Card title={item.name} bordered={false} className={classnames({
                    "current": item.name === name,
                    "winner": item.name === (winner.name || game.winner.name)
                  })}>
                    <Title level={2} className='score' >{item.score}</Title>
                    <div>
                      <Button type='ghost' size='large' onClick={() => this.handleEditScoreMinus(item)}><MinusCircleOutlined /></Button>
                      {item.playerId === playerId && <Button type='ghost' size='large' onClick={() => this.handleEditScorePlus()}><PlusCircleOutlined /></Button>}
                    </div>
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
            {isGameOver ? <Button type='primary' size='large' className='success-btn' block={true} disabled={isGameActive} onClick={() => this.handleReset()}><RedoOutlined />Reset</Button> :
              <Button type='primary' size='large' className='success-btn' block={true} disabled={isGameActive} onClick={() => this.handleStart()}><PlayCircleOutlined />Start</Button>}
          </Col>
        </Row>

        {/* Confirmation modal */}
        <Modal className='game' title={<Title level={4}>{`Has ${name} answered the question?`}</Title>} visible={isConfirmationModalVisible} footer={false} closable={false}>

          <Button type='primary' className='success-btn' block={true} onClick={() => this.handleYes()}><CheckOutlined />Yes</Button>

          <Divider />

          <Button type='primary' danger={true} className='start-btn' block={true} onClick={() => this.handleNo()}><CloseOutlined />No</Button>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state: any, props: any) {
  const { match } = props
  if (match.params.gameId) {
    return {
      game: state.games.find((item: GameProp) => item.gameId === match.params.gameId)
    }
  }
}

export default connect(mapStateToProps, { getGame, updateGame, updatePlayer, updateQuestion, resetGame })(Game);
