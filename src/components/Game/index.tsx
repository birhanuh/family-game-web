import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, List, Typography, Modal, Divider, Alert, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, MinusCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { GameProp, PlayerProp, QuestionProp, UpdateGameProp } from "../../actions/types";
import { getGame } from '../../actions/games'
import { updateGame, updatePlayer, updateQuestion, resetGame } from '../../actions/games'
import { useParams } from "react-router";
import classnames from "classnames";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";
import { withRouter } from "../../withRouter";

const myCanvas: any = document.getElementById('canvas');

const myConfetti = confetti.create(myCanvas, {
  resize: true,
  useWorker: true,
});

const cling = require('../../audios/cling.mp3');
const clingAudio = new Audio(cling);

const confettiA = require('../../audios/confetti.mp3');
const confettiAudio = new Audio(confettiA);

const { Title } = Typography;

interface GameProps {
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

interface DispatchProps {
  getGame: (id: string) => Promise<void>;
  updateGame: (game: UpdateGameProp) => Promise<void>;
  updatePlayer: (player: PlayerProp) => Promise<void>;
  updateQuestion: (question: QuestionProp) => Promise<void>;
  resetGame: (id: string) => Promise<void>;
}

// interface MatchParams {
//   gameId: string;
// };

interface StateProps {
  game?: GameProp;
}

let countdown: any;

const Game = ({ game, getGame, updateGame, updatePlayer, updateQuestion, resetGame }: StateProps & DispatchProps) => {
  const params = useParams();

  const [gameState, setGameState] = useState<GameProps>({
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
  });

  useEffect(() => {
    // Set Game when id is present in params
    if (params.gameId) {
     getGame(params.gameId)
    }
  }, [])

  useEffect(() => {
    if (game) {
      const { gameId, winner, title, players, questions } = game;

      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);

      if (questionsFiltered.length === 0) {
        setGameState(({
          ...gameState,
          isGameOver: true
        }));

        if (Object.keys(winner).length === 0) {
          const maxScore =  players.reduce((acc: number, val: PlayerProp) => 
            (val.score > acc) ? val.score : acc, 0);

          // Calculate draw
          const winners = players.filter((player: PlayerProp) => player.score === maxScore && player);

          if (winners.length === 1) {
            updateGame({ gameId, title, winner: winners[0] });

            setGameState(({
              ...gameState,
              winner: winners[0]
            }));

            // Play confetti
            confettiAudio.play();

            myConfetti();
          }
        }
      }
    }
  },[game])

  useEffect(() => {
    // Stop countdown
    clearInterval(countdown);
  },[])

  const handleReset = () => {
    if (game) {      
    resetGame(game.gameId);

    // Active game back
    setGameState(({
      ...gameState,
      isGameOver: false
    }));

    // Reset nextPlayerIndex
    localStorage.setItem(game.gameId, '0');
    }
  }

  const handleStart = () => {
    setGameState(({
      ...gameState,
      seconds: 30,
      isGameActive: true,
      noCurrentPlayerError: false
    }));

    let secondsCloned = 30;

    const { game: { gameId, players, questions } } = gameState;
    const { nextPlayerIndex } = gameState;

    // Pick current Player
    const nextPlayerIndexFromStorage = localStorage.getItem(gameId);
    const nextPlayerIndexDrived = nextPlayerIndexFromStorage && nextPlayerIndexFromStorage.length > 0 ? parseInt(nextPlayerIndexFromStorage) : nextPlayerIndex;

    const currentPlayer = players[nextPlayerIndexDrived] ? players[nextPlayerIndexDrived] : players[0];

    setGameState(({
      ...gameState,
      currentPlayer: { gameId, ...currentPlayer },
      nextPlayerIndex: players.indexOf(currentPlayer) + 1
    }));

    // Save nextPlayerIndex to storage for page refresh
    localStorage.setItem(gameId, (players.indexOf(currentPlayer) + 1).toString());

    const questionsFiltered = questions.filter((question: any) => !question.isAsked);
    // Pick current Question
    const random = Math.floor(Math.random() * questionsFiltered.length);

    const currentQuestion = questionsFiltered[random];

    setGameState(({
      ...gameState,
      currentQuestion: { gameId, ...currentQuestion },
    }));

    // Start countdown
    countdown = setInterval(() => {
      if (secondsCloned > 0) {
        setGameState((state: GameProps) => ({
          ...gameState,
          seconds: state.seconds - 1
        }));

        secondsCloned = secondsCloned - 1;

        // Play cling
        if (secondsCloned < 6) {
          // cling
          clingAudio.play();
        }
      } else if (secondsCloned === 0) {
        handleConfirmationModal();

        secondsCloned = -1;
      }
    }, 1000);
  }

  // Confirmation
  const handleConfirmationModal = () => {
    setGameState(({
      ...gameState,
      isConfirmationModalVisible: true
    }));
  };

  const handleYes = () => {
    const { currentPlayer, currentQuestion } = gameState;

    updatePlayer({ ...currentPlayer, score: currentPlayer.score + 1 });

    updateQuestion({ ...currentQuestion, isAsked: true });

    setGameState(({
      ...gameState,
      isGameActive: false,
      isConfirmationModalVisible: false
    }));
  }

  const handleNo = () => {
    const { currentQuestion } = gameState;

    updateQuestion({ ...currentQuestion, isAsked: true });

    setGameState(({
      ...gameState,
      isGameActive: false,
      isConfirmationModalVisible: false
    }));
  }

  const handleEditScoreMinus = (passedPlayer: PlayerProp) => {
    const { game: { gameId } } = gameState;
    updatePlayer({ gameId, ...passedPlayer, score: passedPlayer.score - 1 });
  };

  const handleEditScorePlus = () => {
    const { currentPlayer, currentQuestion } = gameState;

    if (currentPlayer.gameId?.length !== 0) {
      // Stop countdown
      clearInterval(countdown);

      setGameState(({
        ...gameState,
        seconds: 30,
        isGameActive: false,
      }));

      updatePlayer({ ...currentPlayer, score: currentPlayer.score + 1 });

      updateQuestion({ ...currentQuestion, isAsked: true });
    } else {
      setGameState(({
        ...gameState,
        noCurrentPlayerError: true,
      }));
    }
  };

  const { seconds, currentPlayer: { playerId, name }, currentQuestion: { question }, winner, isGameActive, isGameOver, isConfirmationModalVisible, noCurrentPlayerError } = gameState;
  
  return (
    <>
      <Row
        justify="center"
        style={{ display: 'flex', textAlign: 'right' }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={20} className='back-reset-game'>
          <Breadcrumb items={[{ title: <Link to='/'><ArrowLeftOutlined style={{ marginRight: 8}} />Back to games</Link> }, { title: game?.title}]} />

          <Button type='dashed' className='reset-btn' onClick={() => handleReset()}><RedoOutlined />Reset</Button>
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
          {/* Confetti for winner player */}
          <canvas id='canvas' style={{ height: 0 }} />

          <List
            grid={{
              gutter: 48,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            className='player-items'
            split={true}
            style={{ textAlign: 'center' }}
            dataSource={game && game.players}
            renderItem={(item: PlayerProp) => (
              <List.Item>

                <Card title={item.name} bordered={false} className={classnames({
                  "current": item.name === name,
                  "winner": (item.name === (winner.name || game?.winner.name))
                })}>
                  <Title level={2} className='score' >{item.score}</Title>
                  <div>
                    <Button type='default' size='large' onClick={() => handleEditScoreMinus(item)}><MinusCircleOutlined /></Button>
                    {item.playerId === playerId && <Button type='default' size='large' onClick={() => handleEditScorePlus()}><PlusCircleOutlined /></Button>}
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
          {isGameOver ? <Button type='primary' size='large' className='success-btn' block={true} disabled={isGameActive} onClick={() => handleReset()}><RedoOutlined />Reset</Button> :
            <Button type='primary' size='large' className='success-btn' block={true} disabled={isGameActive} onClick={() => handleStart()}><PlayCircleOutlined />Start</Button>}
        </Col>
      </Row>

      {/* Confirmation modal */}
      <Modal className='game' title={<Title level={4}>{`Has ${name} answered the question?`}</Title>} open={isConfirmationModalVisible} footer={false} closable={false}>

        <Button type='primary' className='success-btn' block={true} onClick={() => handleYes()}><CheckOutlined />Yes</Button>

        <Divider />

        <Button type='primary' danger={true} className='start-btn' block={true} onClick={() => handleNo()}><CloseOutlined />No</Button>
      </Modal>
    </>
  );
}

function mapStateToProps(state: any, props: any) {  
  if (props.router.params.gameId) {
    return {
      game: state.games.find((item: GameProp) => item.gameId === props.router.params.gameId)
    }
  }
}

export default withRouter(connect<StateProps, DispatchProps>(mapStateToProps as any, { getGame, updateGame, updatePlayer, updateQuestion, resetGame } as any)(Game));
