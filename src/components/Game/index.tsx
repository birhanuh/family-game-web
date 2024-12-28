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
  status: 'start' | 'stop' | 'reset';
  currentQuestionId: string;
  currentPlayerId: string;
  winner: PlayerProp;
  nextPlayerIndex: number;
  showConfetti: boolean;
  isConfirmationModalVisible: boolean;
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
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameProps>({
    status: 'stop',
    currentQuestionId: '',
    currentPlayerId:'',
    winner: { playerId: '', name: '', score: 0 },
    isConfirmationModalVisible: false,
    nextPlayerIndex: 0,
    showConfetti: false,
  });
  
  useEffect(() => {
    // Set Game when id is present in params
    if (params.gameId) {
     getGame(params.gameId);
    }
  }, [params.gameId])

  useEffect(() => {
    if (game) {
      const { winner, players, questions } = game;

      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);

      if (questionsFiltered.length === 0) {
        
        setIsGameOver(true);
        
        setSeconds(0);
        
        if (Object.keys(winner).length === 0) {
          const maxScore =  players.reduce((acc: number, val: PlayerProp) => 
            (val.score > acc) ? val.score : acc, 0);

          // Calculate draw
          const winners = players.filter((player: PlayerProp) => player.score === maxScore && player);

          if (winners.length === 1) {
            updateGame({ ...game, winner: winners[0] }).then(() => {
              setGameState(({
                ...gameState,
                winner: winners[0],
                currentPlayerId: '',
                currentQuestionId: '',
                showConfetti: true
              }));

              // Play confetti
              confettiAudio.play();
            });
          }
        }
      }
    }
  },[game])

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout;

    if (gameState.showConfetti) {      
      timeout = setTimeout(() => setGameState(({
        ...gameState,
        showConfetti: false
      })), 10000)
    }

    return () => clearInterval(timeout);
  }, [gameState.showConfetti]);

  useEffect(() => {
    if (gameState.status === 'start' && seconds < 6) {
      clingAudio.play();
    } 
    
    if (gameState.status === 'start' && seconds === 0) {
      // Show confirmation dialog
      setGameState(({
        ...gameState,
        status: 'stop',
        isConfirmationModalVisible: true
      }));
    }
  }, [seconds, gameState.status]);

  useEffect(() => {
    let interval: undefined | NodeJS.Timeout;

    const { status } = gameState;

    if (status == 'start') {
    setSeconds(30);
      interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (status === 'stop') {
      clearInterval(interval);
    } else if (status === 'reset') {
      clearInterval(interval);
      setSeconds(30);
    }

    return () => clearInterval(interval);
  }, [gameState.status]);

  const handleStart = useCallback(() => {
    const { nextPlayerIndex } = gameState;

    if (game) {
      const { gameId, players, questions } = game;

      // Pick current Player
      const nextPlayerIndextorage = localStorage.getItem(gameId);
      const nextPlayerIndexDrived = nextPlayerIndextorage ? parseInt(nextPlayerIndextorage) : nextPlayerIndex;
      const currentPlayer = players[nextPlayerIndexDrived] ? players[nextPlayerIndexDrived] : players[0];
      
       // Pick current Question
      const questionsFiltered = questions.filter((question: QuestionProp) => !question.isAsked);
      const random = Math.floor(Math.random() * questionsFiltered.length);
      const currentQuestion = questionsFiltered[random];

      // Save nextPlayerIndex to storage for page refresh
      localStorage.setItem(gameId, (players.indexOf(currentPlayer) + 1).toString());

      setGameState(({
        ...gameState,
        currentPlayerId: currentPlayer.playerId,
        currentQuestionId: currentQuestion.questionId,
        status: 'start',
        nextPlayerIndex: players.indexOf(currentPlayer) + 1
      }));
    }
  }, [game, gameState]);

  const handleYesNo = useCallback((action: ConfirmActionType) => {
    const { currentPlayerId, currentQuestionId} = gameState;

    const player = game?.players.find(player => player.playerId === currentPlayerId && player);
    const question = game?.questions.find(question => question.questionId === currentQuestionId && question);
    
    if(game && player && question) {
      if (action === 'yes') {
        updatePlayer({ ...player, score: player.score + 1 }, game.gameId);  
      }

      updateQuestion({ ...question, isAsked: true }, game.gameId);
    }

    setGameState(({
      ...gameState,
      isConfirmationModalVisible: false
    }));
  }, [game, gameState])

  const handleEditScore = useCallback((action: EditScoreType) => {
    const { currentPlayerId, currentQuestionId } = gameState;
    
    const player = game?.players.find(player => player.playerId === currentPlayerId);
    const question = game?.questions.find(question => question.questionId === currentQuestionId);

    if (game && player && question) {
      if (action === 'minus' && player.score > 0) {
       updatePlayer({ ...player, score: player.score - 1 }, game.gameId); 
      } 

      if (action === 'plus') {
       updatePlayer({ ...player, score: player.score + 1 }, game.gameId);  
      }

      updateQuestion({ ...question, isAsked: true }, game.gameId); 
    }

    // Reset countdown
    setGameState(({
      ...gameState,
      status: 'stop'
    }));
  }, [game, gameState]);

  const handleReset = () => {
    if (game) {      
      resetGame(game.gameId);

      // Reset nextPlayerIndex
      localStorage.setItem(game.gameId, '0');
    }

    // Reset countdown
    setGameState(({
      ...gameState,
      currentPlayerId: '',
      currentQuestionId: '',
      status: 'reset'
    }));

    setIsGameOver(false);
  }

  const { currentPlayerId, currentQuestionId, winner, status, isConfirmationModalVisible, showConfetti } = gameState;
  
  const player = game?.players.find(player => player.playerId === currentPlayerId)?.name;
  const question = game?.questions.find(question => question.questionId === currentQuestionId)?.question;

  return (
    <>
      <Row
        justify="center"
        style={{ display: 'flex', textAlign: 'right' }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={20}>
          <Breadcrumb items={[{ title: <Link to='/'><ArrowLeftOutlined style={{ marginRight: 8}} />Back to games</Link> }, { title: game?.title}]} />
          <Button onClick={handleReset}><RedoOutlined />Reset</Button>
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
        <Col xs={24} sm={24} md={24} lg={24} xl={20}  style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={2}>{game?.questions.length ? question : '---'}</Title>
          <Title style={{ color: seconds < 6 ? '#E36A24' : ''}}>{seconds}</Title>
        </Col>
      </Row>
      <Row
        justify="center"
        style={{ marginTop: 40 }}
      >
        <Col flex="auto" xs={24} sm={24} md={24} lg={24} xl={20}>
          {/* Confetti for winner player */}
          {showConfetti && <FireWorks autorun={{ speed: 3 }} />}
          <List
            grid={{
              gutter: 400,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
            loading={!game}
            split={true}
            dataSource={game?.players}
            renderItem={(item: PlayerProp) => (
              <List.Item style={{ textAlign: 'center' }}>
                <Card title={`${item.name} ${(winner.name || game?.winner.name) === item.name ? '🎉' : ''}`} bordered={false} className={classnames({
                  "current": !(winner.name || game?.winner.name) && item.name === player,
                  "winner": (item.name === (winner.name || game?.winner.name))
                })}>
                    <Title level={3}>{item.score}</Title>
                    <Row justify="center">       
                      <Col span={14} style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {item.playerId === currentPlayerId && <Button type='default' size='large' onClick={() => handleEditScore('plus')}><PlusCircleOutlined /></Button>}
                        {status === 'stop' && item.playerId === currentPlayerId && <Button type='primary' danger={true} size='large' onClick={() => handleEditScore('minus')}><MinusCircleOutlined /></Button>}
                      </Col>
                    </Row>
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 60 }}>
        <Col span={8} offset={8}>
          <Button type='default' size='large' block={true} disabled={status === 'start' || isGameOver} onClick={handleStart}>
            <PlayCircleOutlined /> Start
          </Button>
        </Col>
      </Row>

      {/* Confirmation modal */}
      <Modal title={<Title level={5}>{`Has ${name} answered the question?`}</Title>} open={isConfirmationModalVisible} footer={false} closable={false}>
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
