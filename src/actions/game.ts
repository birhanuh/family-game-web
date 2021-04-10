import axios from 'axios'
import { CREATE_GAME, GET_GAMES, GET_GAME, UPDATE_GAME, DELETE_GAME, GameProp } from './types'

export function createGameAction(title: string) {
  return {
    type: CREATE_GAME,
    title
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

export function deletedGameAction(id: string) {
  return {
    type: DELETE_GAME,
    id
  }
}

export function createGame(game: any) {
  return (dispatch: any) => {
    return axios.post(`${process.env.API_URL}/games`, game).then(res => {
      dispatch(createGameAction(res.data.result))
    })
  }
}

export function getGames() {
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/games`).then(res => {
      dispatch(getGamesAction(res.data.results))
    })
  }
}

export function getGame(id: string) {
  console.log('GA: ', id);
  return (dispatch: any) => {
    return axios.get(`${process.env.API_URL}/games/${id}`).then(res => {
      dispatch(getGameAction(res.data.result))
    })
  }
}

export function updateGame(game: GameProp) {
  return (dispatch: any) => {
    return axios.put(`${process.env.API_URL}/games/${game.id}`, game).then(res => {
      dispatch(updatedGameAction(res.data.result))
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