import axios from 'axios'
import { ADD_PLAYER, GET_PLAYERS, GET_PLAYER, UPDATE_PLAYER, DELETE_PLAYER, PlayerProp } from './types'

export function addPlayerAction(name: string) {
  return {
    type: ADD_PLAYER,
    name
  }
}

export function getPlayersAction(player: [PlayerProp]) {
  return {
    type: GET_PLAYERS,
    player
  }
}

export function getPlayerAction(question: PlayerProp) {
  return {
    type: GET_PLAYER,
    question
  }
}

export function updatedPlayerAction(question: PlayerProp) {
  return {
    type: UPDATE_PLAYER,
    question
  }
}

export function deletedPlayerAction(id: string) {
  return {
    type: DELETE_PLAYER,
    id
  }
}

export function addPlayer(title: string) {
  return (dispatch: any) => {
    return axios.post('/api/player', title).then(res => {
      dispatch(addPlayerAction(res.data.result))
    })
  }
}

export function getPlayers() {
  return (dispatch: any) => {
    return axios.get('/api/player').then(res => {
      dispatch(getPlayersAction(res.data.results))
    })
  }
}

export function getPlayer(id: string) {
  return (dispatch: any) => {
    return axios.get(`/api/player/${id}`).then(res => {
      dispatch(getPlayerAction(res.data.result))
    })
  }
}

export function updatePlayer(question: PlayerProp) {
  return (dispatch: any) => {
    return axios.put(`/api/player/${question.id}`, question).then(res => {
      dispatch(updatedPlayerAction(res.data.result))
    })
  }
}

export function deletePlayer(id: string) {
  return (dispatch: any) => {
    return axios.delete(`/api/player/${id}`).then(() => {
      dispatch(deletedPlayerAction(id))
    })
  }
}