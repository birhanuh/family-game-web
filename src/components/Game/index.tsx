import React, { PureComponent } from "react";
import { Button, Card, Col, Row, List, Typography } from 'antd';
import { PlayCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { GameProp, PlayerProp, QuestionProp } from "../../actions/types";
import { getGame } from '../../actions/game'
import { updatePlayer } from '../../actions/player'
import { updateQuestion } from '../../actions/question'
import { RouteComponentProps } from "react-router";

const { Title } = Typography;

interface State {
  seconds: number;
}

interface MatchParams {
  gameId: string;
};

interface Props {
  getGame: (id: string) => void;
  updatePlayer: (player: PlayerProp) => Promise<void>;
  updateQuestion: (question: QuestionProp) => Promise<void>;
  game: GameProp;
}

class Game extends PureComponent<RouteComponentProps<MatchParams> & Props, State> {
  state = {
    seconds: 30
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props

    if (match.params.gameId) {
      this.props.getGame(match.params.gameId);
    }
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

function mapStateToProps(state: any, props: any) {
  const { match } = props
  if (match.params.id) {
    return {
      game: state.games.find((item: GameProp) => item.id === match.params.id)
    }
  }
}

export default connect(mapStateToProps, { getGame, updatePlayer, updateQuestion })(Game);
