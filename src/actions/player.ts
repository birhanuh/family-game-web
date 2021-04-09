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

export function getPlayerAction(player: PlayerProp) {
  return {
    type: GET_PLAYER,
    player
  }
}

export function updatedPlayerAction(player: PlayerProp) {
  return {
    type: UPDATE_PLAYER,
    player
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

export function updatePlayer(player: PlayerProp) {
  return (dispatch: any) => {
    return axios.put(`/api/player/${player.id}`, player).then(res => {
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