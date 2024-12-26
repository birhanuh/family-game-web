import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Row, List, Typography, Modal, Divider, Breadcrumb, Alert } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, MinusCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, RedoOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { GameProp, PlayerProp, QuestionProp, UpdateGameProp } from "../../actions/types";
import { getGame } from '../../actions/games'
import { updateGame, updatePlayer, updateQuestion, resetGame } from '../../actions/games'
import { useParams } from "react-router";
import classnames from "classnames";
import FireWorks from "react-canvas-confetti/dist/presets/fireworks";
import { Link } from "react-router-dom";
import { withRouter } from "../../withRouter";

const cling = require('../../audios/cling.mp3');
const clingAudio = new Audio(cling);

const confettiA = require('../../audios/confetti.mp3');
const confettiAudio = new Audio(confettiA);

const { Title } = Typography;

interface GameProps {
  status: 'start' | 'pause' | 'reset';
  currentQuestion: QuestionProp;
  currentPlayer: PlayerProp;
  winner: PlayerProp;
  isConfirmationModalVisible: boolean;
  nextPlayerIndex: number;
  isLoading: boolean;
}

interface DispatchProps {
  getGame: (id: string) => Promise<void>;
  updateGame: (game: UpdateGameProp) => Promise<void>;
  updatePlayer: (player: PlayerProp, gameId: string) => Promise<void>;
  updateQuestion: (question: QuestionProp, gameId: string) => Promise<void>;
  resetGame: (id: string) => Promise<void>;
}

// interface MatchParams {
//   gameId: string;
// };

interface StateProps {
  game?: GameProp;
}

type ConfirmActionType = 'yes' | 'no';

type EditScoreType = 'plus' | 'minus';

const Game = ({ game, getGame, updateGame, updatePlayer, updateQuestion, resetGame }: StateProps & DispatchProps) => {
  const params = useParams();

  const [seconds, setSeconds] = useState<number>(30);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameProps>({
    status: 'pause',
    currentQuestion: { questionId: '', question: '', isAsked: false },
    currentPlayer: { playerId: '', name: '', score: 0 },
    winner: { playerId: '', name: '', score: 0 },
    isConfirmationModalVisible: false,
    nextPlayerIndex: 0,
    isLoading: false,
  });
  
  useEffect(() => {
    setGameState(({
      ...gameState,
      isLoading: true
    }));

    // Set Game when id is present in params
    if (params.gameId) {
     getGame(params.gameId).then(() =>  setGameState(({
      ...gameState,
      isLoading: false
    })))
    }
  }, [params.gameId])

  useEffect(() => {    
    if (game) {
      const { winner, players, questions } = game;

      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);

      if (questionsFiltered.length === 0) {
        
        setIsGameOver(true);
        
        if (Object.keys(winner).length === 0) {
          const maxScore =  players.reduce((acc: number, val: PlayerProp) => 
            (val.score > acc) ? val.score : acc, 0);

          // Calculate draw
          const winners = players.filter((player: PlayerProp) => player.score === maxScore && player);

          if (winners.length === 1) {
            updateGame({ ...game, winner: winners[0] });

            setGameState(({
              ...gameState,
              winner: winners[0]
            }));

            // Play confetti
            confettiAudio.play();

            setShowConfetti(true);
          }
        }
      }
    }
  },[game])

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout;

    timeout = setTimeout(() => setShowConfetti(false), 10000)

    return () => clearInterval(timeout);
  }, [gameState.winner]);

  useEffect(() => {
    if (seconds < 6) {
      clingAudio.play();
    } 
    
    if (seconds === 0) {
      // Show confirmation dialog
      setGameState(({
        ...gameState,
        status: 'reset',
        isConfirmationModalVisible: true
      }));
    }
  }, [seconds]);

  useEffect(() => {
    let interval: undefined | NodeJS.Timeout;

    const {status} = gameState;

    if (status == 'start') {
      interval = setInterval(() => setSeconds(second => second - 1), 1000);
    } else if (status === 'pause') {
      clearInterval(interval);
    } else if (status === 'reset') {
      clearInterval(interval);

      setSeconds(30);

      setGameState(({
        ...gameState,
        status: 'reset',
      }));
    }

    return () => clearInterval(interval);
  }, [gameState.status]);

  const handleStart = useCallback(() => {
    const { nextPlayerIndex } = gameState;

    if (game) {
      const { gameId, players, questions } = game;

      // Pick current Player
      const nextPlayerIndexFromStorage = localStorage.getItem(gameId);
      const nextPlayerIndexDrived = nextPlayerIndexFromStorage && nextPlayerIndexFromStorage.length > 0 ? parseInt(nextPlayerIndexFromStorage) : nextPlayerIndex;
      const currentPlayer = players[nextPlayerIndexDrived] ? players[nextPlayerIndexDrived] : players[0];
      
       // Pick current Question
      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);
      const random = Math.floor(Math.random() * questionsFiltered.length);
      const currentQuestion = questionsFiltered[random];

      // Save nextPlayerIndex to storage for page refresh
      localStorage.setItem(gameId, (players.indexOf(currentPlayer) + 1).toString());
  
      setGameState(({
        ...gameState,
        currentPlayer,
        currentQuestion,
        status: 'start',
        nextPlayerIndex: players.indexOf(currentPlayer) + 1
      }));
    }
  }, [game, gameState]);

  const handleYesNo = (action: ConfirmActionType) => {
    const { currentPlayer, currentQuestion } = gameState;

    if(game) {
      if (action === 'yes') {
        updatePlayer({ ...currentPlayer, score: currentPlayer.score + 1 }, game.gameId);  
      }

      updateQuestion({ ...currentQuestion, isAsked: true }, game.gameId);
    }

    setGameState(({
      ...gameState,
      isConfirmationModalVisible: false
    }));
  }

  const handleEditScore = (action: EditScoreType) => {
    const { currentPlayer, currentQuestion } = gameState;
    
    if (game) {
      updatePlayer({ ...currentPlayer, score: action === 'plus' ? currentPlayer.score + 1 : currentPlayer.score - 1 }, game.gameId);

      updateQuestion({ ...currentQuestion, isAsked: true }, game.gameId); 
    }

    // Reset countdown
    setGameState(({
      ...gameState,
      status: 'pause'
    }));
  };

  const handleReset = () => {
    if (game) {      
      resetGame(game.gameId);

      // Reset nextPlayerIndex
      localStorage.setItem(game.gameId, '0');
    }

    // Reset countdown
    setGameState(({
      ...gameState,
      status: 'reset'
    }));

    setIsGameOver(false);
  }

  const { currentPlayer: { playerId, name }, currentQuestion: { question }, winner, status, isConfirmationModalVisible, isLoading } = gameState;
  
  return (
    <>
      <Row
        justify="center"
        style={{ display: 'flex', textAlign: 'right' }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <Breadcrumb items={[{ title: <Link to='/'><ArrowLeftOutlined style={{ marginRight: 8}} />Back to games</Link> }, { title: game?.title}]} />
          <Button type='dashed' className='reset-btn' onClick={() => handleReset()}><RedoOutlined />Reset</Button>
        </Col>
      </Row>
      {(winner.name || game?.winner.name) && <Row
        justify="center"
        style={{ display: 'flex', textAlign: 'center' }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <Alert
            style={{ marginTop: 20, marginBottom: 20 }}
            message={`${winner.name || game?.winner.name} has won this game, congratulations 🎉`}
            type="success"
            showIcon={true}
          />
        </Col>
      </Row>}
      <Row
        justify="space-around"
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
          {/* Confetti for winner player */}
          {showConfetti && <FireWorks autorun={{ speed: 3 }} />}
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
            loading={isLoading}
            split={true}
            style={{ textAlign: 'center' }}
            dataSource={game && game.players}
            renderItem={(item: PlayerProp) => (
              <List.Item>
                <Card title={`${item.name} ${(winner.name || game?.winner.name) === item.name ? '🎉' : ''}`} bordered={false} className={classnames({
                  "current": !(winner.name || game?.winner.name) && item.name === name,
                  "winner": (item.name === (winner.name || game?.winner.name))
                })}>
                  <Title level={2} className='score' >{item.score}</Title>                  
                  <Row
                    justify="center"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      {item.playerId === playerId && <Button type='default' size='large' onClick={() => handleEditScore('plus')}><PlusCircleOutlined /></Button>}
                    </Col>
                    {status === 'pause' && item.playerId === playerId && <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <Button type='primary' danger={true} size='large' onClick={() => handleEditScore('minus')}><MinusCircleOutlined /></Button>
                    </Col>}
                  </Row>
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
          <Button type='default' size='large' block={true} disabled={status === 'start'} onClick={() => isGameOver ? handleReset() : handleStart()}>
          {isGameOver ? <RedoOutlined /> : <PlayCircleOutlined /> }
          {isGameOver ? ' Reset' : ' Start' }
          </Button>
        </Col>
      </Row>

      {/* Confirmation modal */}
      <Modal className='game' title={<Title level={4}>{`Has ${name} answered the question?`}</Title>} open={isConfirmationModalVisible} footer={false} closable={false}>
        <Button type='default' block={true} onClick={() => handleYesNo('yes')}><CheckOutlined />Yes</Button>
        <Divider />
        <Button type='primary' danger={true} block={true} onClick={() => handleYesNo('no')}><CloseOutlined />No</Button>
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
