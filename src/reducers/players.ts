import { ADD_PLAYER, GET_PLAYERS, GET_PLAYER, UPDATE_PLAYER, DELETE_PLAYER, PlayerProp } from '../actions/types'

export default function players(state = [], action = { id: '', type: '', players: [], player: { id: '' } }) {
  switch (action.type) {

    case GET_PLAYERS:
      return action.players

    case ADD_PLAYER:
      return [
        ...state,
        action.player
      ]

    case GET_PLAYER:
      const index = state.findIndex((item: PlayerProp) => item.id === action.player.id)
      if (index > -1) {
        return state.map((item: PlayerProp) => {
          if (item.id === action.player.id) return action.player
          return item
        })
      } else {
        return [
          ...state,
          action.player
        ]
      }

    case UPDATE_PLAYER:
      return state.map((item: PlayerProp) => {
        if (item.id === action.player.id) return action.player
        return item
      })

    case DELETE_PLAYER:
      return state.filter((item: PlayerProp) => item.id !== action.id)

    default: return state
  }
}