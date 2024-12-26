import axios from 'axios'
import {
  GameProp, PlayerProp, QuestionProp, DeleteQuestionProp, DeletePlayerProp, UpdateGameProp
} from './types'
import {
  CREATE_GAME, GET_GAMES, GET_GAME, UPDATE_GAME, RESET_GAME, DELETE_GAME,
  ADD_PLAYER, UPDATE_PLAYER, DELETE_PLAYER,
  ADD_QUESTION, UPDATE_QUESTION, DELETE_QUESTION, 
} from '../constants/games'

export function createGameAction(game: GameProp) {
  return {
    type: CREATE_GAME,
    game
  }
}

export function getGamesAction(games: [GameProp]) {
  return {
    type: GET_GAMES,
    games
  }
}

export function getGameAction(game: GameProp) {
  return {
    type: GET_GAME,
    game
  }
}

export function updatedGameAction(game: GameProp) {
  return {
    type: UPDATE_GAME,
    game
  }
}

export function resetGameAction(game: GameProp) {
  return {
    type: RESET_GAME,
    game
  }
}

export function deletedGameAction(id: string) {
  return {
    type: DELETE_GAME,
    id
  }
}

export function createGame(game: GameProp) {
  return (dispatch: any) => {
    return axios.post(`${process.env.API_URL}/games/create`, game).then(res => {
      dispatch(createGameAction(res.data));
    })
  }
}

export function getGames() {
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/games`).then(res => {
      dispatch(getGamesAction(res.data.Items))
    })
  }
}

export function getGame(id: string) {
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/games/get/${id}`).then(res => {
      dispatch(getGameAction(res.data.Item))
    })
  }
}

export function updateGame(game: UpdateGameProp) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${game.gameId}/update`, game).then(res => {
      dispatch(updatedGameAction(res.data));
    })
  }
}

export function resetGame(id: string) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${id}/reset`).then(res => {
      dispatch(resetGameAction(res.data.Attributes))
    })
  }
}

export function deleteGame(id: string) {
  return (dispatch: any) => {
    return axios.delete(`${process.env.API_URL}/games/${id}`).then(() => {
      dispatch(deletedGameAction(id))
    })
  }
}

// PLAYER
export function addPlayerAction(player: PlayerProp, gameId: string) {
  return {
    type: ADD_PLAYER,
    player,
    gameId
  }
}

export function updatedPlayerAction(player: PlayerProp, gameId: string) {
  return {
    type: UPDATE_PLAYER,
    player,
    gameId
  }
}

export function deletedPlayerAction(player: DeletePlayerProp, gameId: string) {
  return {
    type: DELETE_PLAYER,
    player,
    gameId
  }
}

export function addPlayer(player: PlayerProp, gameId: string) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${gameId}/players/add`, { name: player.name }).then(res => {
      dispatch(addPlayerAction(res.data, gameId));
    })
  }
}

export function updatePlayer(player: PlayerProp, gameId: string) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${gameId}/players/${player.playerId}/update`, player).then(res => {
      dispatch(updatedPlayerAction(res.data, gameId));
    })
  }
}

export function deletePlayer(player: DeletePlayerProp, gameId: string) {
  return (dispatch: any) => {
    return axios.delete(`${process.env.API_URL}/games/${gameId}/players/${player.playerId}/delete`).then(res => {
      dispatch(deletedPlayerAction(res.data, gameId));
    })
  }
}

// QUESTION
export function addQuestionAction(question: QuestionProp, gameId: string) {
  return {
    type: ADD_QUESTION,
    question,
    gameId
  }
}

export function updatedQuestionAction(question: QuestionProp, gameId: string) {
  return {
    type: UPDATE_QUESTION,
    question,
    gameId
  }
}

export function deletedQuestionAction(question: DeletePlayerProp, gameId: string) {
  return {
    type: DELETE_QUESTION,
    question,
    gameId
  }
}

export function addQuestion(question: QuestionProp, gameId: string) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${gameId}/questions/add`, { question: question.question }).then(res => {
      dispatch(addQuestionAction(res.data, gameId));
    })
  }
}

export function updateQuestion(question: QuestionProp, gameId: string) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${gameId}/questions/${question.questionId}/update`, question).then(res => {
      dispatch(updatedQuestionAction(res.data, gameId));
    })
  }
}

export function deleteQuestion(question: DeleteQuestionProp, gameId: string) {
  return (dispatch: any) => {
    return axios.delete(`${process.env.API_URL}/games/${gameId}/questions/${question.questionId}/delete`).then(res => {
      dispatch(deletedQuestionAction(res.data, gameId));
    })
  }
}