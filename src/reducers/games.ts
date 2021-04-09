import { CREATE_GAME, GET_GAMES, GET_GAME, UPDATE_GAME, DELETE_GAME, GameProp } from '../actions/types'

export default function games(state = [], action = { id: '', type: '', games: [], game: { id: '' } }) {
  switch (action.type) {

    case GET_GAMES:
      return action.games

    case CREATE_GAME:
      return [
        ...state,
        action.game
      ]

    case GET_GAME:
      const index = state.findIndex((item: GameProp) => item.id === action.game.id)
      if (index > -1) {
        return state.map((item: GameProp) => {
          if (item.id === action.game.id) return action.game
          return item
        })
      } else {
        return [
          ...state,
          action.game
        ]
      }

    case UPDATE_GAME:
      return state.map((item: GameProp) => {
        if (item.id === action.game.id) return action.game
        return item
      })

    case DELETE_GAME:
      return state.filter((item: GameProp) => item.id !== action.id)

    default: return state
  }
}